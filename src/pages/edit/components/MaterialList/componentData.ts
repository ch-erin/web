import { shallowRef } from "vue";
import { VButton, VText, VInput, VImage, VIcon } from "@/components/MaterialList/index.ts";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export const componentMap: { [key: string]: any } = {
  "v-button": VButton,
  "v-text": VText,
  "v-input": VInput,
  "v-image": VImage,
  "v-icon": VIcon,
};

const commonContainerStyle = {
  width: "150px",
  height: "50px",
  padding: "10px",
  margin: "5px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
};


const commonStyle = {
  zIndex: 1
}
export const elementsList = shallowRef([
  {
    name: "v-button",
    component: VButton,
    isLock: false,
    attrs: {
      propValue: "按钮",
      icon: "el-icon-circle-plus",
      label: "按钮",
    },
    style: {
      width: "80px",
      height: "40px",
      fontSize: "14px",
      fontWeight: "500",
      lineHeight: "1.5",
      letterSpacing: "0",
      textAlign: "center",
      color: "#ffffff",
      backgroundColor: "#007bff",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "rgb(39, 136, 240)",
      borderRadius: "4px",
      cursor: "pointer",
      outline: "none",
      position: "absolute",
      transform: "rotate(0deg)",
      ...commonStyle
    },
    containerStyle: { ...commonContainerStyle },
  },
  {
    name: "v-input",
    component: VInput,
    isLock: false,
    attrs: {
      propValue: "请输入内容",
      icon: "el-icon-document",
      label: "文本框",
    },
    style: {
      width: "100px",
      height: "30px",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "1.5",
      letterSpacing: "0",
      textAlign: "left",
      color: "#333333",
      backgroundColor: "#ffffff",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "rgb(39, 136, 240)",
      borderRadius: "4px",
      position: "absolute",
      transform: "rotate(0deg)",
      ...commonStyle
    },
    containerStyle: { ...commonContainerStyle },
  },
]);

export const textList = shallowRef([
  {
    name: "v-text",
    component: VText,
    attrs: {
      propValue: "文本",
      icon: "el-icon-edit",
      label: "文本",
    },
    isLock: false,
    style: {
      width: "80px",
      height: "30px",
      fontSize: "14px",
      fontWeight: "500",
      lineHeight: "1.5",
      letterSpacing: "0",
      textAlign: "center",
      color: "#333333",
      backgroundColor: "",
      paddingTop: "5px",
      paddingRight: "10px",
      paddingBottom: "5px",
      paddingLeft: "10px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#dddddd",
      borderRadius: "4px",
      position: "absolute",
      transform: "rotate(0deg)",
      ...commonStyle
    },
    containerStyle: { ...commonContainerStyle },
  },
]);



export const imageList = shallowRef([
  {
    name: "v-image",
    component: VImage,
    isLock: false,
    attrs: {
      propValue: "https://pic3.zhimg.com/v2-12469c89e1b4190325b0c9f8b9778aee_r.jpg",
      icon: "el-icon-picture",
      label: "图片",
    },
    style: {
      width: "40px",
      height: "40px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#ccc",
      borderRadius: "4px",
      position: "absolute",
      transform: "rotate(0deg)",
      ...commonStyle
    },
    containerStyle: { ...commonContainerStyle },
  },
])


export const iconList = shallowRef([
  {
    name: "EditIcon",
    component: ElementPlusIconsVue.Edit,
    attrs: {
      label: "编辑",
    },
    style: {
      ...commonStyle,
    },
    containerStyle: { ...commonContainerStyle },
  },
  {
    name: "DeleteIcon",
    component: ElementPlusIconsVue.Delete,
    attrs: {
      label: "删除",
    },
    style: {
      ...commonStyle,
    },
    containerStyle: { ...commonContainerStyle },
  },
  {
    name: "SearchIcon",
    component: ElementPlusIconsVue.Search,
    attrs: {
      label: "搜索",
    },
    style: {
      ...commonStyle,
    },
    containerStyle: { ...commonContainerStyle },
  },
  {
    name: "PlusIcon",
    component: ElementPlusIconsVue.Plus,
    attrs: {
      label: "添加",
    },
    style: {
      ...commonStyle,
    },
    containerStyle: { ...commonContainerStyle },
  },
]);