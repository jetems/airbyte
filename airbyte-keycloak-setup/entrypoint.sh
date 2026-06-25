#!/bin/bash
echo "Waiting for Keycloak at ${KEYCLOAK_INTERNAL_HOST}..."
until curl --output /dev/null --silent --head --fail "http://${KEYCLOAK_INTERNAL_HOST}/auth/realms/master"; do
  echo "Keycloak not ready, retrying..."
  sleep 2
done
echo "Keycloak ready, running setup..."
/app/airbyte-app/bin/airbyte-keycloak-setup
