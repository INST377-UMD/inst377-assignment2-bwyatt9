
if (annyang) {
    var generalCommands = {
      'hello': function() { alert('Hello World'); },
      'change the color to *color': function(color) { 
        console.log('changing color to', color);
        document.body.style.backgroundColor = color;
      },
      'navigate to *page': function(page) {
        page = page.toLowerCase();
        if (page == 'home' || page == 'index') window.location.href = 'index.html';
        else if (page == 'stocks') window.location.href = 'stocks.html';
        else if (page == 'dogs') window.location.href = 'dogs.html';
        else alert('Page not found: ' + page);
      }
    };
    annyang.addCommands(generalCommands);
  }
  
  var carouselUl = document.getElementById('carousel');
  var breedsDiv = document.getElementById('breeds');
  var breedInfoDiv = document.getElementById('breed-info');
  var shownBreedNames = new Set();
  
  fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      console.log(data);
      data.message.forEach(function(imgUrl) {
        var li = document.createElement('li');
        li.className = 'glide__slide';
        li.innerHTML = '<img src="' + imgUrl + '" style="width:300px; height:200px;">';
        carouselUl.appendChild(li);
  
        var parts = imgUrl.split('/');
        var breed = parts[4];
        var mainBreed = (breed.indexOf('-') != -1) ? breed.split('-')[0] : breed;
        shownBreedNames.add(mainBreed);
      });
  
      requestAnimationFrame(function() {
        new Glide('.glide', { type: 'carousel', perView: 1 }).mount();
      });
  
      fetch('https://api.thedogapi.com/v1/breeds')
        .then(function(res) { return res.json(); })
        .then(function(allBreeds) {
          console.log('all breeds loaded:', allBreeds.length);
          allBreeds.forEach(function(breedObj) {
            var lowerName = breedObj.name.toLowerCase();
            var matched = null;
            shownBreedNames.forEach(function(b) {
              if (lowerName.indexOf(b) != -1) matched = b;
            });
            if (matched) {
              var btn = document.createElement('button');
              btn.className = 'custom';
              btn.textContent = breedObj.name;
              btn.onclick = function() {
                console.log('clicked button for', breedObj.name);
                showBreedInfo(breedObj);
              };
              breedsDiv.appendChild(btn);
  
              if (annyang) {
                var voiceCmd = {};
                voiceCmd['load dog breed ' + breedObj.name.toLowerCase()] = function() {
                  showBreedInfo(breedObj);
                };
                annyang.addCommands(voiceCmd);
              }
            }
          });
        });
    });
  
  function showBreedInfo(breed) {
    console.log('showing info for', breed.name);
    breedInfoDiv.style.display = 'block';
  
    var minLife = '';
    var maxLife = '';
    if (breed.life_span && breed.life_span.indexOf('–') != -1) {
      var parts = breed.life_span.split('–');
      minLife = parts[0].trim();
      maxLife = parts[1].trim();
    } else if (breed.life_span && breed.life_span.indexOf('-') != -1) {
      var parts2 = breed.life_span.split('-');
      minLife = parts2[0].trim();
      maxLife = parts2[1].trim();
    } else {
      minLife = breed.life_span || 'N/A';
      maxLife = breed.life_span || 'N/A';
    }
  
    breedInfoDiv.innerHTML = 
      '<h2>' + breed.name + '</h2>' +
      '<p><strong>Temperament:</strong> ' + (breed.temperament || 'N/A') + '</p>' +
      '<p><strong>Min Life:</strong> ' + minLife + '</p>' +
      '<p><strong>Max Life:</strong> ' + maxLife + '</p>' +
      (breed.image ? '<img src="' + breed.image.url + '" style="max-width:300px; margin-top:10px;">' : '');
  }
  