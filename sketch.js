let numbers, colWidth, sorter, nCols, points, done, speed, completed, algorithm;

document.getElementById('start').addEventListener('click', () => {
    speed = parseInt(document.getElementById('speed').value);
    loop();
});
document.getElementById('speed').addEventListener('input', () => speed = document.getElementById('speed').value);
document.getElementById('reload').addEventListener('click', () => resetSketch());
document.getElementById('items').addEventListener('input', () => resetSketch());
document.getElementById('algorithm').addEventListener('change', () => resetSketch());

function setup() {
    createCanvas(windowWidth, windowHeight-100).position(0, 100);
    resetSketch();
    noStroke();
    noLoop();   
}

function draw() {
    clear();
    background(0);

    for (let i = 0; i < speed; i++) done = sorter.next().done;

    if(!done){
        drawColumns();
    }else{
        drawColumns();
        calculatePoints();
        drawPoints();
        drawLines();
        points = [];
        noLoop();
    }
}

function windowResized(){
    for (let i = 0; i < 2; i++) {
        resizeCanvas(windowWidth, windowHeight-100);
        colWidth = width / nCols;        
    }    
}

function resetSketch(){
    noLoop();
    algorithm = document.getElementById('algorithm').value;
    nCols = parseInt(document.getElementById('items').value);
    points = new Array();
    completed = 0;
    done = false;
    colWidth = width / nCols;
    numbers = Array(nCols).fill().map(() => random(0.05, 0.95));
    speed = 0;   
    switch(algorithm){
        case 'Bubble Sort': sorter = bubbleSort(); break;
        case 'Insertion Sort': sorter = insertionSort(); break;
        case 'Selection Sort': sorter = selectionSort(); break;
        case 'Quick Sort': sorter = quickSort(0, numbers.length-1); break;
    }
    clear();
    background(0); 
    drawColumns();
}

function drawColumns(){
    noStroke();
    numbers.forEach((num, index) => {
        let colHeight = map(num, 0, 1, 0, height);
        let hue = map(num, 0, 1, 0, 360);

        colorMode(HSL);        
        fill(hue, 100, 50, 0.6);
        if(!done){
            if(algorithm === 'Bubble Sort'){
                if(index > numbers.length - completed - 1) fill(hue, 100, 50);
            }else if(algorithm === 'Insertion Sort'){
                if(index < completed) fill(hue, 100, 50);
            }else if(algorithm === 'Selection Sort'){
                if(index < completed) fill(hue, 100, 50);
            }else if(algorithm === 'Quick Sort'){
                if(index < completed) fill(hue, 100, 50);
            }
        }else{
            fill(hue, 100, 50);
        }

        rect(index * colWidth, height, colWidth, -colHeight);
    });
}

function calculatePoints(){
    numbers.forEach((num, index) => {     
        let colHeight = map(num, 0, 1, 0, height);      
        points.push([index * colWidth + (colWidth/2), height-colHeight]);
    });
}

function drawPoints(){
    stroke(255);
    strokeWeight(colWidth/4);
    points.forEach(p => point(p[0], p[1]));
    noStroke();
} 

function drawLines(){
    stroke(255);
    strokeCap(ROUND);
    strokeWeight(2);
    for (let i = 0; i < points.length-1; i++)
        line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
    noStroke();
}


/* SORTING ALGORITHMS */

function* bubbleSort() {
	for (let i = 0; i < numbers.length; i++) {
        completed = i;
		for (let j = 0; j < numbers.length-i; j++) {    
			if (numbers[j-1] > numbers[j]) {
                let t = numbers[j-1];
				numbers[j-1] = numbers[j];
                numbers[j] = t;            
                yield;
            }           
		}
    }
}

function* insertionSort() { 
    let n = numbers.length; 
    for (i = 1; i < n; i++) { 
        completed = i;
        let key = numbers[i]; 
        let j = i - 1; 
      
        while (j >= 0 && numbers[j] > key) { 
            numbers[j+1] = numbers[j];   
            j--;  
            yield;            
        } 
      
        numbers[j+1] = key;
    } 
}

function* selectionSort(){
    let i,m,j;
    for (i = -1; ++i < numbers.length;) {
      for (m = j = i; ++j < numbers.length;) {
        if (numbers[m] > numbers[j]) m = j;
      }
      [numbers[m], numbers[i]] = [numbers[i], numbers[m]];
      yield;
      completed = i+2;
   }
}



function swap(leftIndex, rightIndex){
    var temp = numbers[leftIndex];
    numbers[leftIndex] = numbers[rightIndex];
    numbers[rightIndex] = temp;
}
function partition(left, right) {
    var pivot   = numbers[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;
    while (i <= j) {
        while (numbers[i] < pivot) {
            i++;
        }
        while (numbers[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(i, j);
            i++;
            j--;
        }
    }
    return i;
}

function* quickSort(left, right) {
    var index;

    if (numbers.length > 1) {
        yield;
        index = partition(left, right);
        completed = index;
        if (left < index - 1) {
            yield* quickSort(left, index - 1);
        }
        if (index < right) {
            yield* quickSort(index, right);
        }
    }
}