<template>
  <div>
    <div class="file-upload" :class="fileUploadClasses">
      <div class="file-upload-label">
        {{ label }}
      </div>

      <div class="file-upload-wrapper">
        <OurSvgIcon name="Uploaded-file" color="gray" :size="descriptionIconSize" />

        <div class="file-upload-description">
          {{ allowedFileForDownloadTitle }}
        </div>
      </div>

      <div class="file-upload-list">
        <div v-for="(file, index) in files" :key="index" class="file-upload-item">
          <div class="file-upload-item-block">
            <img v-if="file.imageUrl" class="file-upload-item-image" :src="file.imageUrl" />

            <OurSvgIcon v-else name="File" color="gray" size="lg" />

            <div class="file-upload-item-title">
              {{ file.meta.name }}
            </div>
          </div>

          <OurSvgIcon
            class="file-upload-item-close"
            name="Close"
            interactive
            :size="size"
            color="gray"
            @click="onClickDeleteFile(index)"
          />
        </div>
      </div>

      <OurButton
        class="file-upload-button"
        :text="$t('component.ourUppload.selectFile')"
        :size="buttonSize"
        variant="transparent"
        @click="onClickUploadFile"
      />

      <DragDrop :uppy="uppy" class="uppy-upload" />
    </div>

    <p v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/vue";
import OurSvgIcon from "@/components/OurSvgIcon";
import OurButton from "@/components/OurButton";

export default {
  name: "OurFileInput",

  components: {
    OurButton,
    DragDrop,
    OurSvgIcon,
  },

  props: {
    downloadedFiles: {
      type: [Array, File],
      default: () => [],
    },

    /**
     * Set label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Set max file size in megabytes.
     */
    maxFileSizeInMegabytes: {
      type: Number,
      default: 1,
    },

    /**
     * Allow to select multiple files.
     */
    multiple: {
      type: Boolean,
      default: false,
    },

    /**
     * Set max number files for upload
     */
    maxFiles: {
      type: Number,
      default: 3,
    },

    /**
     * Set allowed file types.
     */
    allowedFileTypes: {
      type: Array,
      default: () => [".png", ".jpg", ".jpeg", ".pdf", ".txt", ".doc", ".docx", "xls", ".xlsx"],
    },

    /**
     * Set error text for component.
     */
    error: {
      type: String,
      default: function () {
        this.$t("validation.required");
      },
    },

    /**
     * Set size.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },
  },

  data: () => ({
    files: [],
  }),

  computed: {
    ...mapGetters("breakpoint", ["isPortableDevice"]),

    allowedFileForDownloadTitle() {
      const allowedFormat = this.allowedFileTypes.toString().split(",").join(", ");

      return `${this.$t("component.ourUppload.selectOrDragImage")} ${allowedFormat}`;
    },

    descriptionIconSize() {
      const size = {
        sm: "md",
        md: "lg",
        lg: "2lg",
      };

      return size[this.size];
    },

    fileUploadClasses() {
      return {
        "error-file-upload": this.error,
        "size-sm": this.size === "sm",
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
      };
    },

    buttonSize() {
      return this.size === "lg" ? "lg" : "md";
    },

    maxFileSizeInBytes() {
      return this.maxFileSizeInMegabytes * Math.pow(2, 20);
    },

    uppy() {
      return new Uppy({
        restrictions: {
          maxFileSize: this.maxFileSizeInBytes,
          maxNumberOfFiles: this.maxFilesNumber,
          allowedFileTypes: this.allowedFileTypes,
        },
      });
    },

    maxFilesNumber() {
      return this.multiple ? this.maxFiles : 1;
    },
  },

  watch: {
    files: {
      handler: "onChangeFiles",
      deep: true,
    },

    downloadedFiles: {
      handler: "onChangeDownloadedFiles",
      deep: true,
      immediate: true,
    },
  },

  created() {
    this.uppy.on("file-added", () => {
      this.uploadFiles();
    });
  },

  methods: {
    onClickUploadFile() {
      document.querySelector(".uppy-Root").click();

      this.uppy.on("files-added", () => {
        this.uploadFiles();
      });
    },

    uploadFiles() {
      const { files } = this.uppy.getState();

      const preparedFiles = Object.values(files);
      let filteredFiles = [];

      preparedFiles.forEach((item) => {
        const isSimilarFile = this.files.find((file) => file.meta.name === item.meta.name);

        if (!isSimilarFile) {
          filteredFiles.push(item);
        }
      });

      const filesLength = filteredFiles.length + this.files.length;
      const newFiles = [...this.files, ...filteredFiles];

      if (filesLength > this.maxFiles) {
        newFiles.splice(this.maxFiles, filesLength);
      }

      this.files = [...newFiles];
    },

    onChangeDownloadedFiles() {
      if (this.downloadedFiles.length && !this.files.length) {
        this.downloadedFiles?.forEach((item) => {
          this.files.push({
            data: item.file,
            imageUrl: item.imageUrl,
            meta: { name: item.file.name },
          });
        });
      }
    },

    onChangeFiles() {
      this.uppy.cancelAll();

      const filesData = this.files.map((file) => file.data);

      this.$emit("changeFiles", filesData);
    },

    onClickDeleteFile(index) {
      this.files.splice(index, 1);
    },
  },
};
</script>

<style lang="postcss" scoped>
.size {
  &-sm {
    .file-upload {
      &-label {
        @apply text-xs;
      }

      &-description {
        @apply text-xs;
      }

      &-item {
        &-image {
          @apply h-8 w-8;
        }

        &-title {
          @apply text-xs;
        }
      }
    }
  }

  &-md {
    .file-upload {
      &-label {
        @apply text-sm;
      }

      &-description {
        @apply text-sm;
      }

      &-item {
        &-image {
          @apply h-10 w-10;
        }

        &-title {
          @apply text-sm;
        }
      }
    }
  }

  &-lg {
    .file-upload {
      &-label {
        @apply text-base;
      }

      &-description {
        @apply text-base;
      }

      &-item {
        &-image {
          @apply h-12 w-12;
        }

        &-title {
          @apply text-base;
        }
      }
    }
  }
}

.file-upload {
  @apply relative;
  @apply rounded-lg border border-dashed border-gray-300;
  @apply p-4;

  &:hover {
    @apply border-gray-400 bg-gray-50;
  }

  &-label {
    @apply font-normal text-gray-500;
  }

  &-wrapper {
    @apply flex;
    @apply mt-2 mb-4 space-x-2;
  }

  &-description {
    @apply font-normal text-gray-700;
  }

  &-button {
    @apply w-full;
  }

  &-list {
    @apply mb-4 space-y-4;
  }

  &-item {
    @apply flex items-center justify-between;
    @apply border-b border-gray-200;
    @apply pb-2;

    &-block {
      @apply flex items-center;
    }

    &-image {
      @apply rounded-sm;
    }

    &-title {
      @apply font-medium text-gray-900;
      @apply ml-4;
    }

    &-close {
      @apply z-20;
    }
  }
}

.uppy-upload {
  @apply absolute top-0 left-0;
  @apply h-0 w-0;
  @apply opacity-0;

  &::v-deep {
    .uppy-Root {
      @apply !h-0 !w-0;
    }
  }
}

.error {
  &-message {
    @apply text-xs font-normal text-red-500;
    @apply mt-2 pl-4;
  }

  &-file-upload {
    @apply border-red-300;

    &:hover {
      @apply border-red-400;
    }
  }
}
</style>
