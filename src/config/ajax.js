  export default (type = 'GET', url = '', data = {}, async = true) => {
    return new Promise((resolve, reject) => { //定义一个promise
      type = type.toUpperCase();
      let xhr;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject('Microsoft.XMLHttp');
      }
      let token = window.localStorage.getItem('x-auth-token');
      xhr.setRequestHeader("x-auth-token", token);
      if (type == 'GET') {
        if(data){
          url = url + '?' + data;
        }
        xhr.open(type, url, async);
        xhr.send();
      } else if (type == 'POST') {
        xhr.open(type, url, async);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//必须,否则无法传参
        xhr.send(data);
      } else {
        reject('error type');
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            let result = xhr.responseText;
            resolve(result);
          } else {
            reject(xhr);
          }
        }
      }
    })
  }
  