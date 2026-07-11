import io.airbyte.gradle.tasks.DockerBuildxTask

plugins {
  id("io.airbyte.gradle.docker") apply false
}

tasks.register<DockerBuildxTask>("dockerJavaBaseImage") {
  inputDir = project.projectDir
  dockerfile = layout.projectDirectory.file("./Dockerfile")
  // Jetems publish sets DOCKER_TAG=<version>-<arch>; fall back to .version (e.g. 3.3.13)
  val versionFileTag = layout.projectDirectory.file(".version").asFile.readText().trim()
  val envTag = System.getenv("DOCKER_TAG")?.trim().orEmpty()
  tag = envTag.ifEmpty { versionFileTag }
  additionalTags =
    if (envTag.isNotEmpty()) {
      // Release build: only the env tag (arch-specific); avoid clobbering major/minor tags
      emptyList()
    } else {
      listOf(
        versionFileTag.substringBeforeLast("."), // Minor version mutable tag
        versionFileTag.substringBeforeLast(".").substringBeforeLast("."), // Major
      )
    }
  // Native per-arch publish (jetems); empty = host default
  val envPlatform = System.getenv("DOCKER_PLATFORM")?.trim().orEmpty()
  if (envPlatform.isNotEmpty()) {
    platform = envPlatform
  }
  imageName = "airbyte-base-java-image"
}

// Alias so jetems-publish-images.sh can use the same task name as other modules
tasks.register("dockerBuildImage") {
  dependsOn("dockerJavaBaseImage")
}
