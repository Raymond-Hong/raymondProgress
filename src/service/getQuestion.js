import ajax from '../config/ajax'
// import {baseUrl} from '../config/env'
let baseUrl = 'http://testapi.findmacau.com/fm';

export const questionList = (start = 0, count = 10) => ajax('GET', baseUrl + '/q_a/que', 'start=' + start + '&count=' + count);

export const askQue = (title, content, lat = "", lon = "", img_url = [],anonymous="") => ajax("POST", baseUrl + '/q_a/ask',
    "title=" + title +
    "&content=" + content +
    "&lat=" + lat +
    "&lon=" + lon +
    "&img_url=" + img_url +
    "&anonymous=" + anonymous,true);

export const ansQuestion = (question_id, content, img_url = [], anonymous = "") => ajax("POST", baseUrl + '/q_a/answer',
    'question_id=' + question_id +
    '&content=' + content +
    '&img_url=' + img_url +
    '&anonymous=' + anonymous,true);

export const answerOfQ = (question_id, start = 0, count = 10) => ajax("GET", baseUrl + '/q_a/reply',
    'question_id=' + question_id +
    '&start=' + start +
    '&count=' + count);

export const likeOrUnlike = (answer_id) => ajax("POST", baseUrl + '/q_a/like', 'answer_id=' + answer_id);

export const readQuestion = (question_id) => ajax("POST", baseUrl + '/q_a/read', 'question_id=' + question_id);

export const acceptAnswer = (answer_id) => ajax("POST", baseUrl + '/q_a/accept', 'answer_id=' + answer_id);

export const myQuestions = (start, count) => ajax("GET", baseUrl + '/q_a/my_que', 'start=' + start + '&count=' + count);

export const myAnswers = (start, count) => ajax("GET", baseUrl + '/q_a/my_reply', 'start=' + start + '&count=' + count);

export const getOSSKey = ()=>ajax("POST",baseUrl+'/q_a/oss');

export const getQuesById = (question_id)=>ajax("GET",baseUrl+'/q_a/onlyq','question_id=' + question_id);

export const answerReview = (answer_id,content,parent_id=0)=>ajax("POST",baseUrl+'/q_a/review','answer_id='+answer_id+
    '&content='+content+
    '&parent_id='+parent_id);

export const getReviews = (answer_id,start=0,count=10)=>ajax("GET",baseUrl+'/q_a/getreviews','answer_id='+answer_id+
    '&start=' + start +
    '&count=' + count);

export const ansRewLike = (answer_review_id)=>ajax("POST",baseUrl+'/q_a/arlike','answer_review_id='+answer_review_id);

export const getLikers = (answer_id,start=0,count=10)=>ajax("GET",baseUrl+'/q_a/getusers','answer_id='+answer_id+
    '&start=' + start +
    '&count=' + count);