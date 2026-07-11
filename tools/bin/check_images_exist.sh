#!/usr/bin/env bash

# ------------- Import some defaults for the shell

# Source shell defaults
# $0 is the currently running program (this file)
this_file_directory=$(dirname $0)
relative_path_to_defaults=$this_file_directory/../shell_defaults

# if a file exists there, source it. otherwise complain
if test -f $relative_path_to_defaults; then
  # source and '.' are the same program
  source $relative_path_to_defaults
else
  echo -e "\033[31m\nFAILED TO SOURCE TEST RUNNING OPTIONS.\033[39m"
  echo -e "\033[31mTried $relative_path_to_defaults\033[39m"
  exit 1
fi

set +o xtrace  # +x easier human reading here

. tools/lib/lib.sh

# JETEMS: chart path is charts/v2/airbyte (not charts/airbyte/v2).
CHART_VALUES_PATH="${this_file_directory}/../../charts/v2/airbyte/values.yaml"

function check_chart_image_exist() {
  printf "\nCalling check_chart_image_exists with tag $1...\n"
  local tag=$1

  if [[ ! -f "$CHART_VALUES_PATH" ]]; then
    echo -e "$red_text""Chart values not found at $CHART_VALUES_PATH""$default_text"
    exit 1
  fi

  images=($(grep "repository: airbyte/" "$CHART_VALUES_PATH" | tr -d ' ' | cut -d ':' -f2 | sort -u))
  if [[ ${#images[@]} -eq 0 ]]; then
    echo -e "$red_text""No airbyte/* repositories found in $CHART_VALUES_PATH""$default_text"
    exit 1
  fi

  local missing=0
  for img in "${images[@]}";
  do
      printf "\t${img}:${tag}\n"
      if docker_tag_exists $img $tag; then
        printf "\tSTATUS: found\n\n"
      else
        printf "\tERROR: not found!\n\n"
        missing=1
      fi
  done
  return $missing
}

function docker_tag_exists() {
  # Is true for images stored in the Github Container Registry
  repo=$1
  tag=$2
  # we user [[ here because test doesn't support globbing well
  if [[ $repo == ghcr* ]]
  then
    TOKEN_URL=https://ghcr.io/token\?scope\="repository:$1:pull"
    token=$(curl -fsSL "$TOKEN_URL" | jq -r '.token')
    URL=https://ghcr.io/v2/$1/manifests/$2
    echo -e "$blue_text""\tURL: $URL""$default_text"
    http_code=$(curl -H "Authorization: Bearer $token" --location --silent --show-error \
      --output /dev/null --write-out "%{http_code}" "$URL" || echo "000")
  else
    URL=https://hub.docker.com/v2/repositories/"$1"/tags/"$2"
    echo -e "$blue_text""\tURL: $URL""$default_text"
    # Capture body + status; Docker Hub returns 404 JSON when tag is missing
    http_code=$(curl --silent --show-error --location \
      --output /tmp/dh_tag_body.json --write-out "%{http_code}" \
      --dump-header header.txt "$URL" || echo "000")

    # some bullshit to get the number out of a header that looks like this
    # < content-length: 1039
    # < x-ratelimit-limit: 180
    # < x-ratelimit-reset: 1665683196
    # < x-ratelimit-remaining: 180
    if [[ -f header.txt ]]; then
      docker_rate_limit_remaining=$(grep 'x-ratelimit-remaining: ' header.txt | grep --only-matching --extended-regexp "\d+" || true)
      # too noisy when set to < 1.  Dockerhub starts complaining somewhere around 10
      if [[ -n "$docker_rate_limit_remaining" ]]; then
        if test "$docker_rate_limit_remaining" -lt 20 2>/dev/null; then
          echo -e "$red_text""We are close to a sensitive dockerhub rate limit!""$default_text"
          echo -e "$red_text""SLEEPING 60s sad times""$default_text"
          sleep 60
          docker_tag_exists $1 $2
          return $?
        elif test "$docker_rate_limit_remaining" -lt 50 2>/dev/null; then
          echo -e "$red_text""Rate limit reported as $docker_rate_limit_remaining""$default_text"
        fi
      fi
    fi
  fi

  if [[ "$http_code" == "200" ]]; then
    return 0
  fi
  echo -e "$red_text""\tHTTP $http_code for ${repo}:${tag}""$default_text"
  return 1
}


checkPlatformImages() {
  echo -e "$blue_text""Checking platform images exist...""$default_text"
  # Check dockerhub to see if the images exist
  if ! check_chart_image_exist "$VERSION"; then
    echo -e "$red_text""One or more platform images missing for tag: $VERSION""$default_text"
    return 1
  fi
  return 0
}


main() {
  assert_root

  SUBSET=${1:-all} # default to all.
  [[ ! "$SUBSET" =~ ^(all|platform)$ ]] && echo "Usage ./tools/bin/check_images_exist.sh [all|platform]" && exit 1
  echo -e "$blue_text""checking images for: $SUBSET""$default_text"

  local rc=0
  if [[ "$SUBSET" =~ ^(all|platform)$ ]]; then
    checkPlatformImages || rc=$?
  fi
  echo -e "$blue_text""Image check complete (exit=$rc).""$default_text"
  test -f header.txt     && rm -f header.txt
  test -f /tmp/dh_tag_body.json && rm -f /tmp/dh_tag_body.json
  exit $rc
}

main "$@"
