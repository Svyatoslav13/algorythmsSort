// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  while (fruitsList.firstChild) {
    fruitsList.removeChild(fruitsList.firstChild);
  }

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let temp = document.createElement('li.fruit__item.fruit_violet');
    temp.className = 'fruit__item fruit_violet';
    temp.innerHTML = `
      <div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruits[i]['kind']}</div>
        <div>color: ${fruits[i]['color']}</div>
        <div>weight (кг): ${fruits[i]['weight']}</div>
      </div>`
    fruitsList.appendChild(temp);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    let rand = getRandomInt(0, fruits.length);
    let fruit = fruits[rand];
    fruits.splice(rand, 1);
    result.push(fruit);
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
    fruits = fruits.filter((item) => {
        let min = parseInt(document.querySelector('.minweight__input').value);
        let max = parseInt(document.querySelector('.maxweight__input').value);

        return parseInt(item.weight) < max && parseInt(item.weight) > min;
      });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'quickSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  return a.length > b.length ? true : false;
};

const sortAPI = {
  bubbleSort(arr, comparationColor) {
    const n = arr.length;
    for (let i = 0; i < n-1; i++) { 
        for (let j = 0; j < n-1-i; j++) { 
            if (comparationColor(arr[j].color, arr[j+1].color)) { 
                let temp = arr[j+1].color; 
                arr[j+1].color = arr[j].color; 
                arr[j].color = temp; 
            }
        }
    } 
  },

  quickSort(arr, comparation) {
      const sortedArray = [ ...arr ];

      const recursiveSort = (start, end) => {
        if (end - start < 1) {
          return;
        }

        const pivotValue = sortedArray[end].color;
        let splitIndex = start;
        for (let i = start; i < end; i++) {
          const sort = comparation(sortedArray[i].color, pivotValue);
          if (!sort) {
            if (splitIndex !== i) {
              const temp = sortedArray[splitIndex].color;
              sortedArray[splitIndex].color = sortedArray[i].color;
              sortedArray[i].color = temp;
            }
            splitIndex++;
          }
        }

        sortedArray[end].color = sortedArray[splitIndex].color;
        sortedArray[splitIndex].color = pivotValue;

        recursiveSort(start, splitIndex - 1);
        recursiveSort(splitIndex + 1, end);
      };
      recursiveSort(0, arr.length - 1);
      return sortedArray;
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKind === 'quickSort') {
    sortKind = 'bubbleSort';
    sortKindLabel.textContent = sortKind;
  } else {
    sortKind = 'quickSort'; 
    sortKindLabel.textContent = sortKind;
  }
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  let temp = document.createElement('li.fruit__item.fruit_violet');
  let k = kindInput.value;
  let c = colorInput.value;
  let w = weightInput.value;
  fruits[fruits.length] = {
    'kind' : k,
    'color' : c,
    'weight' : w
  }
  if (!k || !c || !w) { alert('Attention. EMPTY FIELD') }
  display();
});
