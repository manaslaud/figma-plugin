import {showUI } from '@create-figma-plugin/utilities'
import {on,emit} from '@create-figma-plugin/utilities'
import { useState } from 'preact/hooks'
export default function () {
  const [lastSelectedLeftNode,setLastSelectedLeftNode]=useState<SceneNode>()
  const [lastSelectedRightNode,setLastSelectedRightNode]=useState<SceneNode>()

  function handleSubmit (data:any) {
  
    const leftNode:SceneNode=figma.currentPage.selection[0]
    const rightNode:SceneNode=figma.currentPage.selection[1]
    setLastSelectedLeftNode(leftNode)
    setLastSelectedRightNode(rightNode)
    drawArrowBetweenNodes(leftNode,rightNode)
    
   
  }
  function drawArrowBetweenNodes(leftNode:SceneNode,rightNode:SceneNode){
    const startPoint = {
      x: leftNode.x + leftNode.width, 
      y: leftNode.y + leftNode.height / 2 
    };
    const endPoint = {
      x: rightNode.x, 
      y: rightNode.y + rightNode.height / 2 
    };
    const angle = -Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const len:number=Math.sqrt(Math.pow((endPoint.x-startPoint.x),2)+ Math.pow((endPoint.y-startPoint.y),2))
    const arrowLine:LineNode = figma.createLine();
    
    arrowLine.resize(len,0)
    arrowLine.name = `Arrow bw ${leftNode.id} & ${rightNode.id}`;
    arrowLine.x = startPoint.x;
    arrowLine.y = startPoint.y;
    arrowLine.rotation = angle * (180 / Math.PI); 

    figma.currentPage.appendChild(arrowLine);
  }
    
  function handleArrowDeletion(changedNodeId:string|undefined =''){  
    const toRemoveNode=detectAssociatedArrow(changedNodeId)
    console.log(toRemoveNode)
    toRemoveNode?.remove()
    
    
  }
  function detectAssociatedArrow(changedNodeId:string|undefined =''){
    const node:SceneNode|null = figma.currentPage.findOne(n=>n.name.includes(changedNodeId))
      return node
  }

  on('SUBMIT', handleSubmit)
  figma.on("documentchange", (event) => {
    for (const change of event.documentChanges) {
      console.log(change)
      switch (change.type) {
        case "PROPERTY_CHANGE":
          for (const prop of change.properties) {
            if(prop==='x' || prop==='y'){
              handleArrowDeletion(change.id)
            }
            
           
          }
          break;
    
        }
      }
    });

  showUI({
    height: 500,
    width: 500
  })
}
