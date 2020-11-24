const form = document.querySelector('form'),
  responseDisplay = document.getElementById('dreams');

const serializeForm = function (form) {
  var obj = {};
  var formData = new FormData(form);
  for (var key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
};


form.addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = serializeForm(event.target);

  fetch('/', {
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.error) {
      let errorMessage = 'Oh no!'

      switch (data.error.code) {
        case 187:
          errorMessage = `I already said hi to you, ${ formData.name }!`;
          break;
      }
      alert(errorMessage);
    } else {
      if (data.status === 'tweet posted' && data.url) {
        window.open(data.url);
      }
    }
    console.log(data);
  });

  form.reset();
  form.elements.name.focus();
});