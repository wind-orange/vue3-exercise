<template>
  <textarea ref="textAreaRef" class="editor"></textarea>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, ref, watch } from "vue";
import "suneditor/dist/css/suneditor.min.css";
import suneditor from "suneditor";
import plugins from "suneditor/src/plugins";
import lang from "suneditor/src/lang";
const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: { type: String, default: "" },
  extHeight: { type: Number, default: 380 },
  height: { type: Number },
});
const height = computed(() => {
  if (props.height) {
    return props.height;
  }
  return window.innerHeight - props.extHeight;
});

const emit = defineEmits(["update:modelValue"]);
const textAreaRef = ref();
const SunEditor = ref(null);
const init = () => {
  nextTick(() => {
    const editor = suneditor.create(textAreaRef.value, {
      lang: lang.zh_cn,
      height: height.value,
      plugins: plugins,
      buttonList: [
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock"],
        ["paragraphStyle", "blockquote"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
        ["fontColor", "hiliteColor", "textStyle"],
        ["removeFormat"],
        ["outdent", "indent"],
        ["align", "horizontalRule", "list", "lineHeight"],
        ["table", "link", "image", "video", "audio"],
        ["fullScreen", "showBlocks", "codeView"],
        ["preview"],
      ],
    });
    editor.onImageUploadBefore = (files, info, core, uploadHander) => {
      proxy
        .Request({
          url: "file/uploadFile",
          parmas: { file: files[0] },
        })
        .then((res) => {
          if (!res) return;
          uploadHander({
            result: [
              {
                url: "/api/file/getImage/" + res.data,
                name: files[0].name,
                size: files[0].size,
              },
            ],
          });
        });
    };
    // 内容改变
    editor.onBlur = (event, core, contents) => {
      emit("update:modelValue", contents.innerHTML);
    };
    SunEditor.value = editor;
  });
};
init();

watch(
  () => props.modelValue,
  (newVal) => {
    if (SunEditor.value) {
      SunEditor.value.setContents(newVal);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
}
</style>
