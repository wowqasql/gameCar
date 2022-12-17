(function () {
  let isPause = false
  let animationId = null;
  let speed = 3;
  // Получаем элементы
  const gameButton = document.querySelector('.game-button')
  const car = document.querySelector('.car')
  const trees = document.querySelectorAll('.tree')
  const road = document.querySelector('.road')

  const treesCoords = [];
 // Получаем размеры элементов
  const roadHeight = road.clientHeight;
  const carWidth = car.clientWidth;
  const carHeight = car.clientHeight;
  console.dir(car)

  const carCoords = getCoords(car);
  const carMove = {
    top: null,
    bottom: null,
    left: null,
    right: null,
  }
  // Получаем координаты каждого дерева
  for(let i = 0; i < trees.length; i++){
    const tree = trees[i];
    const coordsTree = getCoords(tree)
    treesCoords.push(coordsTree)
  }
  // Событие, которое срабатывает при нажати стрелочных клавиш
  document.addEventListener('keydown', (event) => {
    if(isPause) {
      return;
    }
    const code = event.code;
    if(code === 'ArrowUp'){
// Через requestAnimationFrame вызываем функцию carMoveToTop, которая меняет координаты осей автомобиля
      carMove.top =  requestAnimationFrame(carMoveToTop);
    }
    if(code === 'ArrowDown'){
      carMove.bottom =  requestAnimationFrame(carMoveToBottom);
    }
    if(code === 'ArrowLeft'){
      carMove.left =  requestAnimationFrame(carMoveToLeft);
    }
    if(code === 'ArrowRight'){
      carMove.right =  requestAnimationFrame(carMoveToRight);
    }
  })

  document.addEventListener('keyup', (event) => {
    // Событие, которое срабатывает при убратии нажатия стрелочных клавиш
    const code = event.code;
    if(code === 'ArrowUp'){
// Через ф-цию cancelAnimationFrame удаляем анимацию, которая была записана при событии keydown  в объект carMove
      cancelAnimationFrame(carMove.top);
    }
    if(code === 'ArrowDown'){
      cancelAnimationFrame(carMove.bottom);
    }
    if(code === 'ArrowLeft'){
      cancelAnimationFrame(carMove.left);
    }
    if(code === 'ArrowRight'){
      cancelAnimationFrame(carMove.right);
    }
  })
  // ф-ция меняет координаты оси автомобиля. Если newYCar больше 0, т.е. авто доехал до верхненй части экрана, то ф-ция прерывается.
  function carMoveToTop() {
    var newYCar = carCoords.y - 5;
    if(newYCar < 0){
      return
    }
    carCoords.y = newYCar;
    // Координаты передаются в carDrive
    carDrive(carCoords.x, newYCar)
    
  }
  // ф-ция меняет координаты оси автомобиля.
  function carMoveToBottom() {
    let newYCar = carCoords.y + 5;
    if((newYCar + carHeight) > roadHeight){
      return
    }
    // ф-ция меняет координаты оси автомобиля.
    carCoords.y = newYCar;
    carDrive(carCoords.x, newYCar)
    console.log(roadHeight)
  }
  // ф-ция меняет координаты оси автомобиля.
  function carMoveToLeft() {
    let newXCar = carCoords.x - 5;
    carCoords.x = newXCar;
    carDrive(newXCar, carCoords.y)
  }
  // ф-ция меняет координаты оси автомобиля.
  function carMoveToRight() {
    let newXCar = carCoords.x + 5;
    carCoords.x = newXCar;
    carDrive(newXCar, carCoords.y)
  }
// ф-ция которая записывает новые координаты в style.css
function carDrive(x, y) {
  car.style.transform = `translate(${x}px ,${y}px)`;
}

//ф-ция проходит по каждому дереву и меняет координаты 
  function treesAnimation() {
    for(let i = 0; i < trees.length; i++){
      const tree = trees[i];
      const coords = treesCoords[i];

      let newYCoord = coords.y + speed; 

      if(newYCoord > window.innerHeight){ //window.innerHeight - Высота окна браузера
        newYCoord = -300;

      }
      treesCoords[i].y = newYCoord
      tree.style.transform = `translate(${coords.x}px ,${newYCoord}px)`
    }
  }

// ф-ция получения координат
  function getCoords(element) {
    const matrix = window.getComputedStyle(element).transform // Поулчить стили, кторые прописали в main.css
    const arrayMatrix = matrix.split(',')
    const y = arrayMatrix[arrayMatrix.length - 1] //Получить последний элемент массива
    const x = arrayMatrix[arrayMatrix.length - 2] //Получить предпоследний элемент массива
    const numericY = parseFloat(y) 
    const numericX = parseFloat(x) // parseFloat -преобразовывает строку в цисло И отрезает лишние символы, которые не относятся к числу!
    return {x: numericX, y: numericY}
  } 

  animationId = requestAnimationFrame(startGame); // внутрення JS функция(браузера), нужна чтобы уменьшить лаги(для оптимизации) - возвращает id

  //ф-ция которая запускает анимацию деревьев.
  treesAnimation();
  function startGame() {
    treesAnimation();
    animationId = requestAnimationFrame(startGame); // зацикливание функции startGame
  }

// Событие click на кнопку play-pause 
  gameButton.addEventListener('click', () => {
    isPause = !isPause;                                               //Меняем значение кнопки при клике на нее.
    if(isPause) { 
      cancelAnimationFrame(animationId);                              // если игра находится на паузе, игра останавливается - отключаем анимацию
      // cancelAnimationFrame(carMove.bottom);
      // cancelAnimationFrame(carMove.top);
      gameButton.children[0].style.display = 'none';                  //картинка pause
      gameButton.children[1].style.display = 'initial';               //картинка play
      
    }else{
      gameButton.children[0].style.display = 'initial'; //картинка pause
      gameButton.children[1].style.display = 'none';  //картинка play
      requestAnimationFrame(startGame); //запускаем анимацию, которая вызываает ф-цию startGame
    }
  })
})();