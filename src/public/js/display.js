/**
 * Loads the grid with every entry and results
 * @param {Data} gameData
 */
 function loadGrid(gameData) {
  const gridEl = document.getElementById('grid');
  const tableEl = document.createElement('table');
  const resultClasses = ['none', 'other', 'right'];

  const prefill = Array(gameData.word.length);
  prefill.fill('.');
  prefill[0] = gameData.word[0];
  for (let i = 0; i < gameData.results.length; i++) {
    for (let j = 0; j < gameData.results[i].length; j++) {
      if (prefill[j] === '.' && gameData.results[i][j] === 2) {
        prefill[j] = gameData.entries[i][j];
      }
    }
  }

  for (let i = 0; i < MAXIMUM_TRIES; i++) {
    const trEl = document.createElement('tr');
    const leftTdEl = document.createElement('td');
    const rightTdEl = document.createElement('td');

    leftTdEl.classList.add('padding');
    trEl.appendChild(leftTdEl);

    let line = gameData.entries[i];
    let prefilled = false;
    if (i === gameData.cursor[0] && gameData.cursor[1] === 0) {
      line = prefill;
      prefilled = true;
    }
    for (let j = 0; j < gameData.word.length; j++) {
      const tdEl = document.createElement('td');
      tdEl.textContent = line && line[j] || (i == gameData.cursor[0] ? '.' : '');
      tdEl.classList.add(resultClasses[gameData.results[i] && gameData.results[i][j] || 0]);
      if (i === gameData.cursor[0] && j === gameData.cursor[1]) {
        tdEl.classList.add('cursor');
      }
      if (prefilled) {
        tdEl.classList.add('placeholder');
      }
      trEl.appendChild(tdEl);
    }
    if (gameData.entryDict[i]) {
      rightTdEl.classList.add('dofus');
    } else {
      rightTdEl.classList.add('padding');
    }
    trEl.appendChild(rightTdEl);
    tableEl.appendChild(trEl);
  }
  gridEl.innerHTML = tableEl.outerHTML;
}

/**
 * Load a panel from the given data
 * @param {Object} data { title, header, results, resultsHeader, resultsTable, share, shareText, shareMessage, shareContent }
 */
function loadPanel(data) {
  const panel = document.getElementById('panel');
  const template = document.getElementById('panel-template');
  const contentCopy = template.cloneNode(true);

  contentCopy.id = '';
  contentCopy.classList.remove('invisible');

  const panelTitle = contentCopy.querySelector('h2');
  panelTitle.innerHTML = data.title;

  const headerContent = contentCopy.querySelector('.panel-header');
  headerContent.innerHTML = data.header;

  const resultsHeaderContent = contentCopy.querySelector('.panel-results-header');
  resultsHeaderContent.innerHTML = data.resultsHeader;

  const resultsTable = contentCopy.querySelector('.panel-results-table');
  resultsTable.innerHTML = data.resultsTable;

  const results = contentCopy.querySelector('.panel-results');
  results.innerHTML += data.results;

  if (data.share) {
    const html = `<div id="share"><span>${data.shareText}</span><img class="share-icon" height="20" src="/public/img/icon-share-64.png" alt="share"></div><span class="share-message">${data.shareMessage}</span>`;
    results.innerHTML += html;
    contentCopy.querySelector('#share').addEventListener('click', () => {
      copyResults(data.shareContent);
    });
  }

  contentCopy.querySelector('.panel-cross').addEventListener('click', () => {
    contentCopy.remove();
    panel.classList.add('invisible');
  });

  panel.classList.remove('invisible');
  panel.innerHTML = '';
  panel.appendChild(contentCopy);
}

/**
 * Load the win panel
 * @param {Data} gameData
 */
function loadWinPanel(gameData) {
  const icons = ['icon-black', 'icon-yellow', 'icon-green'];
  let html = '';

  for (let i = 0; i < gameData.results.length; i++) {
    html += '<tr>';
    for (let j = 0; j < gameData.results[i].length; j++) {
      html += `<td class="${icons[gameData.results[i][j]]}"></td>`;
    }
    html += `<td class="${gameData.entryDict[i] ? 'icon-star' : ''}"></td>`;
    html += '</tr>';
  }

  loadPanel({
    title: 'Gagn?? !',
    header: `<p>Vous avez trouv?? le mot : <span id="word">${gameData.word}</span></p><hr>`,
    results: '',
    resultsHeader: `<p>SUFOD n??${gameData.number} : ${gameData.cursor[0]+1}/6</p><p>Mots Dofus : <span id="dofus-words">${gameData.entryDict.filter(x => x).length}</span></p>`,
    resultsTable: html,
    share: true,
    shareText: 'Partager',
    shareMessage: 'Copi?? dans le presse-papier !',
    shareContent: gameData
  });
}

/**
 * Load the lose panel
 * @param {Data} gameData
 */
 function loadLosePanel(gameData) {
  const icons = ['icon-black', 'icon-yellow', 'icon-green'];
  let html = '';
  for (let i = 0; i < gameData.results.length; i++) {
    html += '<tr>';
    for (let j = 0; j < gameData.results[i].length; j++) {
      html += `<td class="${icons[gameData.results[i][j]]}"></td>`;
    }
    html += `<td class="${gameData.entryDict[i] ? 'icon-star' : ''}"></td>`;
    html += '</tr>';
  }

  loadPanel({
    title: 'Perdu !',
    header: `<p>Le mot ??tait : <span id="word">${gameData.word}</span></p><hr>`,
    results: '',
    resultsHeader: `<p>SUFOD n??${gameData.number} : -/6</p><p>Mots Dofus : <span id="dofus-words">${gameData.entryDict.filter(x => x).length}</span></p>`,
    resultsTable: html,
    share: true,
    shareText: 'Partager',
    shareMessage: 'Copi?? dans le presse-papier !',
    shareContent: gameData
  });
}

/**
 * Load the Help panel
 * @param {Data} gameData
 */
 function loadHelpPanel() {
  loadPanel({
    title: 'R??gles du jeu',
    header: `<p>Trouvez le mot du jour.<br>Chaque jour, un nouveau mot est ?? d??couvrir, c'est le m??me mot pour tout le monde.</p><p>Vous avez 6 essais pour tenter de trouver le mot secret. Lorsque vous entrez un mot, le jeu indiquera quelles lettres sont pr??sentes.</p><p>Si la lettre est verte, alors elle est ?? la bonne position. Si elle est jaune alors elle se trouve sur une autre position.</p><hr><p>Le mot secret est un mot apparaissant dans le Monde des Douze. Il peut s'agir du nom d'un monstre, du nom d'un sort de classe ou sort commun, le nom d'une zone, d'une famille de monstre, de troph??e, idole et bien plus encore.</p>`,
    results: 'Exemples<table class="grid"><tbody><tr><td class="padding"></td><td class="none">p</td><td class="right">o</td><td class="none">m</td><td class="none">m</td><td class="none">e</td><td class="padding"></td></tr></tbody></table>La lettre <i>O</i> est pr??sente dans le mot ?? la m??me position.<table class="grid"><tbody><tr><td class="padding"></td><td class="none">b</td><td class="other">u</td><td class="none">t</td><td class="other">o</td><td class="none">r</td><td class="dofus"></td></tr></tbody></table>Les lettres <i>U</i> et <i>O</i> sont pr??sentes dans le mot mais autre part.<br>L\'ic??ne ?? droite du mot signifie qu\'il s\'ag??t d\'un mot du Monde des Douze.<table class="grid"><tbody><tr><td class="padding"></td><td class="right">d</td><td class="right">o</td><td class="right">f</td><td class="right">u</td><td class="right">s</td><td class="dofus"></td></tr></tbody></table>Le mot ?? trouver sera toujours un mot appartenant au Monde des Douze.',
    resultsHeader: '',
    resultsTable: '',
    share: false
  });
}
