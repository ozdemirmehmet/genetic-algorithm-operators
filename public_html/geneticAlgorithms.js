"use strict";

var renderer,camera,scene,genes = [],chromosome = [],selected1 = [],selected2 = [],garbage = [],input;

var id,inputChromosomeId,sortAnimationId,selectionAnimationId;
var unicastCrossingOverId,multicastCrossingOverId,getMutationChromosomeId,replacementValueMutationId,resultId;

var random,point1,point2,counter=0,geneX=-1300,geneY=1100,chromosomeX=250,chromosomeY=1100,j=0,sayac=0,mutationDirection=1,generation=0,similarity=0;
//Gen popülasyonundaki toplam gen sayısı
var MAX_GENES = 100;
//Bir kromozomdaki gen sayısı
var GENES_NUMBER = 10;

//Temel Sahne Elemanları

$(document).ready(function(){
   addContainer();
   setStyle();
   prepareScene();
   addGenes();
   createChromosomeAnimation();
});

function addContainer(){
    $("body").append("<div id='Container' />");
}

function setStyle(){
    $("html,body,#Container").css("widht","100%");
    $("html,body,#Container").css("height","100%");
    $("html,body,#Container").css("margin","0");
    $("html,body,#Container").css("padding","0");
    $("html,body,#Container").css("overflow","hidden");
    $("html,body,#Container").css("bacgroundColor","#000000");
}

function prepareScene(){
    
    var container = $("#Container");
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor( 0xcccccc, 1 );
    renderer.setSize(container.width(),container.height());
    container.append(renderer.domElement);
    scene = new THREE.Scene();
    var aspectRatio = container.width()/container.height();
    camera = new THREE.PerspectiveCamera(120,aspectRatio,0.1,20000);
    camera.position.set(0,0,700);
    camera.lookAt(new THREE.Vector3(0,0,0));
    var ambientLight = new THREE.HemisphereLight(0xffffff,0x222222,0.9);
    scene.add(ambientLight);
    random = Math.floor(Math.random()*MAX_GENES);
    chromosome.push(counter);
    chromosome[counter] = [];
}

function addGenes(){
    
    var geneChar1 = new THREE.Mesh(new THREE.BoxGeometry(200,200,10),new THREE.MeshLambertMaterial({ color: 0x0000ff, transparent:true, opacity:1 }));               
    var geneChar2 = new THREE.Mesh(new THREE.BoxGeometry(200,200,10),new THREE.MeshLambertMaterial({ color: 0xff0000, transparent:true, opacity:1 }));               
    geneChar1.position.set(-2150,-550,0);
    geneChar2.position.set(-1750,-550,0);
    scene.add(geneChar1);
    scene.add(geneChar2);
    
    var i,j,color,posX;
    
    for(i=0 ; i<100 ; i++){
        var a = Math.floor(Math.random()*2);
        switch(a){
            case 0:
                color = 0x0000ff;
                posX = -2150;
                break;
            case 1:
                color = 0xff0000;
                posX = -1750;
                break;
        }
        var gene = new THREE.Mesh(new THREE.BoxGeometry(200,200,10),new THREE.MeshLambertMaterial({ color: color, transparent:true, opacity:1 }));               
        genes.push(gene);
        gene.position.set(posX,-550,0);
        scene.add(gene);
    }
}

//*******************************************************************************************************//



//Kromozomları Oluştur

function createChromosomeAnimation(){
    renderer.render(scene,camera);
    id = requestAnimationFrame(createChromosomeAnimation);
    checkRandomAndPosition();
    moveGene();
}

function checkRandomAndPosition(){
    if(genes[random].position.x == geneX && genes[random].position.y == geneY && genes[random].scale.x < 0.3 && genes[random].scale.y < 0.3){
        chromosome[Math.floor(counter/GENES_NUMBER)].push(genes[random]);
        var gene = genes.pop();
        if(random != genes.length){
            genes[random] = gene;
        }
        counter++;
        if(counter == MAX_GENES){
            chromosomeAnimation();
            cancelAnimationFrame(id);
        }
        else{
            if(counter%GENES_NUMBER == 0){
                chromosome.push(Math.floor(counter/GENES_NUMBER));
                chromosome[Math.floor(counter/GENES_NUMBER)] = [];
                geneX = -1300;
                geneY -= 150;
            }
            else{
                geneX += 100;
            }
            random = Math.floor(Math.random()*(MAX_GENES-counter));
        }
        if(chromosome.length == 2)
            id = requestAnimationFrame(createChromosomeAnimation);
        if(chromosome.length == 9)
            cancelAnimationFrame(id);
    }
}

function moveGene(){
    if(genes.length == 0){
        cancelAnimationFrame(id);
    }
    else{
        if(genes[random].position.x < geneX){
            genes[random].position.x += 10;
        }
        if(genes[random].position.y < geneY){
            genes[random].position.y += 10;
        }
        if(genes[random].scale.x > 0.3){
            genes[random].scale.x -= 0.01;
        }
        if(genes[random].scale.y > 0.3){
            genes[random].scale.y -= 0.01;
        }
    }
}

//*******************************************************************************************************//



//Giriş kromozomunu kromozom popülasyonu içinden rastgele seç

function chromosomeAnimation(){
    renderer.render(scene,camera);
    inputChromosomeId = requestAnimationFrame(chromosomeAnimation);
    moveChromosome();
}

function moveChromosome(){
    if(chromosome.length == MAX_GENES/GENES_NUMBER){
        random = Math.floor(Math.random()*(MAX_GENES/GENES_NUMBER));
        input = chromosome[random];
        var temp = chromosome.pop();
        if(random != chromosome.length){
            chromosome[random] = temp;
        }
    }
    var i;
    for( i=0 ; i<1000 ; i+=100){
        if( input[i/100].position.x < chromosomeX + i ){
            input[i/100].position.x += 10;
        }
        if( input[i/100].position.y < chromosomeY ){
            input[i/100].position.y += 10;
        }
    }
    if(input[0].position.x == chromosomeX && input[0].position.y == chromosomeY){
        cancelAnimationFrame(inputChromosomeId);
        generation++;
        fitness();
        sort();
    }
}

//*******************************************************************************************************//



//Seçilen kromozomları ekranda ilgili yere taşıma

function selectionAnimation(){
    renderer.render(scene,camera);
    selectionAnimationId = requestAnimationFrame(selectionAnimation);
    moveSelected();
}

function moveSelected(){
    var i;
    for( i=0 ; i<1000 ; i+=100){
        
        if( selected1[i/100].position.x < -1000 + i ){
            selected1[i/100].position.x += 10;
        }
        if( selected1[i/100].position.y > -500 ){
            selected1[i/100].position.y -= 10;
        }
        if( selected2[i/100].position.x < 200 + i ){
            selected2[i/100].position.x += 10;
        }
        if( selected2[i/100].position.y > -500 ){
            selected2[i/100].position.y -= 10;
        }
    }
    if(selected1[0].position.x == -1000 && selected1[0].position.y == -500 && selected2[0].position.x == 200 && selected2[0].position.y == -500){
        cancelAnimationFrame(selectionAnimationId);
        var a = Math.floor(Math.random()*2);
        if(a == 0){
            point1 = Math.floor(Math.random()*(GENES_NUMBER-1));
            var i;
            for(i=point1 ; i<GENES_NUMBER ; i++){
                var temp = selected1[i];
                selected1[i] = selected2[i];
                selected2[i] = temp;
            }
            unicastCrossingOverAnimation();
        }
        else{
            point1 = Math.floor(Math.random()*GENES_NUMBER);
            do{
                point2 = Math.floor(Math.random()*GENES_NUMBER);
            }while(point2 == point1);
            if(point1 > point2){
                var temp = point2;
                point2 = point1;
                point1 = temp;
            }
            var i;
            for(i=point1 ; i<point2 ; i++){
                var temp = selected1[i];
                selected1[i] = selected2[i];
                selected2[i] = temp;
            }
            multicastCrossingOverAnimation();
        }
    }
}

//*******************************************************************************************************//



//Çaprazlama(Crossing Over) Metodları

//Tek Noktalı(Unicast) Çaprazlama Yöntemi

function unicastCrossingOverAnimation(){
    renderer.render(scene,camera);
    unicastCrossingOverId = requestAnimationFrame(unicastCrossingOverAnimation);
    unicastCrossingOver();
}

function unicastCrossingOver(){
    var i;
    for(i=0 ; i<(GENES_NUMBER*100) ; i+=100){
        if(i<(point1*100)){
            if( selected1[i/100].position.y > -600 ){
                selected1[i/100].position.y -= 10;
            }
            if( selected2[i/100].position.y > -600 ){
                selected2[i/100].position.y -= 10;
            }
        }
        else{
            if( selected1[i/100].position.x >= -1000 + i ){
                selected1[i/100].position.x -= 10;
            }
            if( selected1[i/100].position.y > -600 ){
                selected1[i/100].position.y -= 10;
            }
            if( selected2[i/100].position.x <= 200 + i ){
                selected2[i/100].position.x += 10;
            }
            if( selected2[i/100].position.y > -600 ){
                selected2[i/100].position.y -= 10;
            }
        }
    }
    if(selected1[point1].position.x == -1000+(point1*100)){
        cancelAnimationFrame(unicastCrossingOverId);
        var a = Math.floor(Math.random()*2);
        if(a == 0){
            //Mutation
            point1 = Math.floor(Math.random()*GENES_NUMBER);
            replacementValueMutationAnimation();
        }
        else{
            generation++;
            fitness();
            sort();
        }
    }
}

//Çok Noktalı(Multicast) Çaprazlama Yöntemi

function multicastCrossingOverAnimation(){
    renderer.render(scene,camera);
    multicastCrossingOverId = requestAnimationFrame(multicastCrossingOverAnimation);
    multicastCrossingOver();
}

function multicastCrossingOver(){
    var i;
    for(i=0 ; i<(GENES_NUMBER*100) ; i+=100){
        if(i<(point1*100) || i>=(point2*100)){
            if( selected1[i/100].position.y > -600 ){
                selected1[i/100].position.y -= 10;
            }
            if( selected2[i/100].position.y > -600 ){
                selected2[i/100].position.y -= 10;
            }
        }
        else{
            if( selected1[i/100].position.x >= -1000 + i ){
                selected1[i/100].position.x -= 10;
            }
            if( selected1[i/100].position.y > -600 ){
                selected1[i/100].position.y -= 10;
            }
            if( selected2[i/100].position.x <= 200 + i ){
                selected2[i/100].position.x += 10;
            }
            if( selected2[i/100].position.y > -600 ){
                selected2[i/100].position.y -= 10;
            }
        }
    }
    if(selected1[point1].position.x == -1000+(point1*100)){
        cancelAnimationFrame(multicastCrossingOverId);
        var a = Math.floor(Math.random()*2);
        if(a == 0){
            //Mutation
            point1 = Math.floor(Math.random()*GENES_NUMBER);
            replacementValueMutationAnimation();
        }
        else{
            generation++;
            fitness();
            sort();
        }
    }
}

//*******************************************************************************************************//



//Mutasyon Metodları

//Mutasyona uğrayacak kromozomu ekranda ilgili yere taşıma

function getMutationChromosomeAnimation(){
    renderer.render(scene,camera);
    getMutationChromosomeId = requestAnimationFrame(getMutationChromosomeAnimation);
    moveMutationChromosome();
}

function moveMutationChromosome(){
    var i;
    for( i=0 ; i<1000 ; i+=100){
        if( selected1[i/100].position.x < -400 + i ){
            selected1[i/100].position.x += 10;
        }
        if( selected1[i/100].position.y > -500 ){
            selected1[i/100].position.y -= 10;
        }
    }
    if(selected1[0].position.x == -400 && selected1[0].position.y == -500){
        cancelAnimationFrame(getMutationChromosomeId);
        point1 = Math.floor(Math.random()*GENES_NUMBER);
        replacementValueMutationAnimation();
    }
}

//Değer Değiştirme Yöntemi

function replacementValueMutationAnimation(){
    renderer.render(scene,camera);
    replacementValueMutationId = requestAnimationFrame(replacementValueMutationAnimation);
    replacementValue();
}

function replacementValue(){
    if(selected1[point1].scale.x > 7)
        mutationDirection = -1;
    if(selected1[point1].scale.x <= 2)
        mutationDirection = 1;
    selected1[point1].scale.x += mutationDirection*0.04;
    selected1[point1].scale.y += mutationDirection*0.04;
    if(selected1[point1].scale.x > 6.9){
        if(selected1[point1].material.color.r == 1)
            selected1[point1].material.color.set(0x0000ff);
        else
            selected1[point1].material.color.set(0xff0000);
    }
    if(selected1[point1].scale.x == 2){
        cancelAnimationFrame(replacementValueMutationId);
        generation++;
        fitness();
        sort();
    }
}

//*******************************************************************************************************//



//Kromozom Sıralama Metodları

function sort(){ 
    var temp,max;
    var i,j;
    for(i=chromosome.length-1 ; i>0 ; i--){
        max = i;
        for(j=i-1 ; j>=0 ; j--){
            if(chromosome[j][GENES_NUMBER] < chromosome[max][GENES_NUMBER]){
                max = j;
            }
        }
        temp = chromosome[i];
        chromosome[i] = chromosome[max];
        chromosome[max] = temp;
    }
    if(chromosome.length>10){
        var i;
        garbage[0] = [];
        for(i=chromosome.length-1 ; i>=10 ; i--){
            garbage.push(copyArray(chromosome[i]));
            removeObject(chromosome[i]);
            chromosome.pop();
        }
    }
    sortAnimation();
}

function sortAnimation(){
    renderer.render(scene,camera);
    sortAnimationId = requestAnimationFrame(sortAnimation);
    checkPosition();
    garbagean();
}

function checkPosition(){
    geneY = 1100;
    geneX = -1300;
    var i,direction;
    for(i=0 ; i<chromosome.length ; i++){
        if(chromosome[i][0].position.y < geneY-(i*150))
            direction = 1;
        else
            direction = -1;
        move(chromosome[i],direction,geneY-(i*150),geneX);
    }
    sayac++;
    if(sayac==170){
        sayac = 0;
        garbage = [];
        cancelAnimationFrame(sortAnimationId);
        fitness();
        if(similarity <=9 && generation <= 15){
            //Sorting
            if(selected1 != 0){
                var index = chromosome.indexOf(selected1);
                if(index >= 0)
                    chromosome[index] = copyArray(selected1);
                removeObject(selected1);
                scene.remove(selected1[GENES_NUMBER+2]);
                selected1 = [];
            }
            if(selected2 != 0){
                var index = chromosome.indexOf(selected2);
                if(index >= 0)
                    chromosome[index]= copyArray(selected2);
                removeObject(selected2);
                scene.remove(selected2[GENES_NUMBER+2]);
                selected2 = [];
            }
            selected1 = copyArray(chromosome[0]);
            selected2 = copyArray(chromosome[1]);
            chromosome.push(selected1);
            chromosome.push(selected2);
            selectionAnimation();
        }
        else
            resultAnimation();
    }
}

function move(array,direction,posY,posX){
    var i;
    for(i=0;i<GENES_NUMBER;i++){
        if(array[i].position.x > posX+(i*100)){
            array[i].position.x -= 10;
        }
        switch(direction){
            case 1:
                if(array[i].position.y < posY){
                    array[i].position.y += direction*10;
                }
                break;
            case -1:
                if(array[i].position.y > posY){
                    array[i].position.y += direction*10;
                }
                break;
        }
    }
}

function garbagean(){
    var i,j;
    for(i=1 ; i<garbage.length ; i++){
        for(j=0 ; j<GENES_NUMBER ; j++){
            if(garbage[i][j].position.y > -700)
                garbage[i][j].position.y -= 10;
            if(garbage[i][j].position.y == -690)
                scene.remove(garbage[i][j]);
        }
    }
}

//*******************************************************************************************************//


//Sonuc Göster

function resultAnimation(){
    renderer.render(scene,camera);
    resultId = requestAnimationFrame(resultAnimation);
    resultChromosome();
}

function resultChromosome(){
    var i;
    for( i=0 ; i<1000 ; i+=100){
        if( chromosome[0][i/100].position.x <= chromosomeX + i ){
            chromosome[0][i/100].position.x += 10;
        }
        if(chromosome[0][i/100].position.y > chromosomeY-250)
            chromosome[0][i/100].position.y -= 10;
    }
    if(chromosome[0][0].position.x == chromosomeX+10 && chromosome[0][0].position.y == chromosomeY-250){
        cancelAnimationFrame(resultId);
    }
}

//*******************************************************************************************************//



//Fitness(Uyumluluk) Fonksiyonu

function fitness(){
    var i,j;
    for( i=0 ; i<chromosome.length ; i++){
    chromosome[i][GENES_NUMBER] = 0;
        for( j=0 ; j<GENES_NUMBER ; j++){
            if(chromosome[i][j].material.color.getHexString() == input[j].material.color.getHexString()){
                chromosome[i][GENES_NUMBER]++;
            }
        }
    }
    similarity = chromosome[0][GENES_NUMBER];
}

//*******************************************************************************************************//



//Ek Metodlar

//Dizi kopyala

function copyArray(array){
    var i;
    var copyArray = [];
    for(i=0 ; i<GENES_NUMBER ; i++){
        var gene = new THREE.Mesh(new THREE.BoxGeometry(30,30,10),new THREE.MeshLambertMaterial());
        gene.scale.x = 2;
        gene.scale.y = 2;
        gene.material.color.set(array[i].material.color);
        var pos = array[i].position;
        gene.position.set(pos.x,pos.y,pos.z);
        copyArray.push(gene);
        scene.add(gene);
    }
    copyArray[GENES_NUMBER] = array[GENES_NUMBER];
    return copyArray;
}

//Ekrandan nesne sil

function removeObject(array){
    var i;
    for(i=0 ; i<=GENES_NUMBER ; i++){
        scene.remove(array[i]);
    }
}

