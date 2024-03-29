import { baseApi } from '@esign-web/libs/utils'

export default {
  uploadDocument: (payload: any) => {
    let item = document.getElementById(payload.id) as HTMLInputElement
    const formData = new FormData()
    formData.append('file', payload.file)

    return baseApi.post('/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        if (!item) {
          item = document.getElementById(payload.id) as HTMLInputElement
        }
        if (item) {
          item.style.strokeDashoffset = `calc(75px - (75px * ${percentCompleted}) / 100)`
        }
      },
    })
  },

  getAllCert: (payload: any) => {
    return baseApi.post('/cert/all', payload)
  },

  getCertDetail: (payload: any) => {
    return baseApi.get(`/cert/info/${payload.certId}`)
  },
  
  
}
