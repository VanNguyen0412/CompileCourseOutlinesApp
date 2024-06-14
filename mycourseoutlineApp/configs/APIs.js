import axios from "axios";

const BASE_URL = 'http://192.168.1.4:8000/';

export const endpoints = {
    'categories': '/categories/',
    'lessons': '/lessons/',
    'outlines': '/outlines/',
    'outline-details': (outlineId) => `/outlines/${outlineId}/`,
    'outline-comment': (outlineId) => `/outlines/${outlineId}/comment/`,
    'outline-create': '/outlines/create/',
    'outline-update': (outlineId) => `/outlines/${outlineId}/update/`,
    'lesson-details': (lessonId) => `/lessons/${lessonId}/`,
    'lesson-course': (lessonId) => `/lessons/${lessonId}/courses/`,
    'lesson-outline': (lessonId) => `/lessons/${lessonId}/outlines/`,
    'lesson-create': '/lessons/create/',
    'login': '/o/token/',
    'current-account': '/accounts/current-account/',
    'add-comment': (outlineId) => `/outlines/${outlineId}/comments/`,
    'update-comment': (commentId) =>  `/comments/${commentId}/`,
    'delete-comment': (commentId) =>   `/comments/${commentId}/`,
    'add-evaluation': (outlineId) => `/outlines/${outlineId}/evaluation/`,
    'add-course': (outlineId) => `/outlines/${outlineId}/course/`,
    'delete-evaluation': (outlineId, evaluationId) => `outline/${outlineId}/evaluation/${evaluationId}/`,
    'outline-download': (outlineId) => `/outlines/${outlineId}/download/`,
    'noapprove-outline':'/outlines/noapprove/',
    'approve-outline': (outlineId) => `/outlines/${outlineId}/approve/`,
    'account-lecturer': 'accounts/lecturer/',
    'approve-student': '/approve/student/',
    'pending-account': '/accounts/pending/',
    'confirm-account': (accountId) => `/accounts/${accountId}/confirm/`,
    'pending-approve': '/approve/pending/',
    'confirm-approve': (approveId) => `/approve/${approveId}/confirm/`
};

export const authApi = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
export default axios.create({
    baseURL: BASE_URL
});