import { baseApi } from '@esign-web/libs/utils';

export default {
  uploadDocument: (payload: any) => {
    let temp = document.getElementById(payload.id) as HTMLInputElement;
    const formData = new FormData();
    formData.append('file', payload.file);

    return baseApi.post('/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (!temp) {
          temp = document.getElementById(payload.id) as HTMLInputElement;
        }
        if (temp) {
          temp.style.strokeDashoffset = `calc(75px - (75px * ${percentCompleted}) / 100)`;
        }
      },
    });
  },

  getDocuments: (payload: any) => {
    return baseApi.post('/document/all', payload);
  },
};
