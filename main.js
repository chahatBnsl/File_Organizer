#!/usr/bin/env node

let inputArr= process.argv.slice(2);
console.log(inputArr);
let fs= require("fs");
let path= require("path");
let command= inputArr[0];

let types= {
    media: ["mp4","mkv"],
    archieves:['zip','7z','rar','tar','gz','ar','iso',"xz"],
    documents:['docx','doc','pdf','xlsx','xls','odt','ods','odp','odg','odf','txt','ps','tex'],
    app:['exe','dmg','pkg',"deb"]
}


switch(command){
case"tree":
    treeFn(inputArr[1]);
    break;

case"organize":
    organizeFn(inputArr[1])
    break;

case "help":
    helpFn();
    break;

default:
    console.log("please input right command");
    break;
}

function treeFn(dirPath){
   // console.log("tree command implemented for", dirPath);
   if(dirPath==undefined){
     treeHelper(process.cwd(),"");
    return;
   }
   else{
    let doesexist= fs.existsSync(dirPath);
    if(doesexist){

      treeHelper(dirpath,"");
    
    }
    else{
        console.log("kindly enter the correct path");
        return;
    }
   }
}

function treeHelper(dirPath, indent){
    //is file or folder
    let isFile= fs.lstatSync(dirPath).isFile();
    if(isFile== true){
        let fileName= path.basename(dirpath);
        console.log(indent + "├───" +fileName);
    }
    else{
        let dirName = path.basename(dirPath);
        console.log(indent+"└───"+ dirName);
        let childrens= fs.readdirSync(dirPath);
        for(let i=0 ; i<childrens.length;i++){
         let childPath=   path.join(dirPath,childrens[i]);
         treeHelper(childPath,indent+"\t");
        }

    }
}

function organizeFn(dirPath){
   // console.log("organize command implemented for", dirPath);
   let destinationPath;
   if(dirPath==undefined){
    destinationPath= process.cwd();
    return;
   }
   else{
    let doesexist= fs.existsSync(dirPath);
    if(doesexist){

        destinationPath = path.join(dirpath,"organized_files");
        if(fs.existsSync(destinationPath)==false){
        fs.mkdirSync(destinationPath);
        }

    }
    else{
        console.log("kindly enter the correct path");
        return;
    }
   }

   organizeHelper(dirPath,destinationPath);

}

function organizeHelper(src,destination){
    let childNames = fs.readdirSync(src);
   // console.log(childNames);  //give file name

   for(let i=0 ; i<childNames.length; i++ ){
    let childrenAddress= path.join(src,childNames[i]);
    let isFile = fs.lstatSync(childrenAddress).isFile();

    if(isFile){
      //  console.log(childNames[i]);
      let category = getCategory(childNames[i]);
      console.log(childNames[i],"belongs to-->", category);

      sendFiles(childrenAddress, destinationPath,category);
    }

   }

}

function getCategory(name){
    let ext =  path.extname(name);
    ext = ext.slice(1);
    for(let type in types ){
        let currentTypeArray = types[type];
        for(let i=0; i<currentTypeArray.length;i++){
            if(ext== currentTypeArray[i]){
                return type;
            }
        }
    }
    return "others";
}

function sendFiles(srcFilePath,destination,category){
    let categoryPath= path.join(destination,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
   let fileName= path.basename(srcFilePath);
   let destinationFilePath= path.join(categoryPath,fileName);
   fs.copyFileSync(srcFilePath,destinationFilePath);
   fs.unlinkSync(srcFilePath);
   console.log(fileName,"copied to-->",category);

}

//help implemented
function helpFn(){
    console.log(`
    list of all the commands:
            node main.js tree"directoryPath"
            node main.js organize"directory path"
            node main.js help
    `);
}
