import { Dialog,Toast } from 'antd-mobile'

// 对话框
export function confirm(title,content,confirmCb,confirmText) {
  Dialog.confirm({
    title,
    content,
    confirmText: confirmText ? confirmText : '确定',
    cancelText: '取消',
    onConfirm:confirmCb
  })
}

// 轻提示
export function toast(content,duration=2000,position='center') {
  Toast.show({
    icon:'',
    content: content,
    duration,
    position
  })
}