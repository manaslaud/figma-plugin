import {showUI } from '@create-figma-plugin/utilities'
// import { useEffect } from 'preact/hooks'
import {on} from '@create-figma-plugin/utilities'
export default function () {
  // const toCheckForNodes:SceneNode[] | null=figma.currentPage.findAll((node:SceneNode)=>{
  //   if(node.getPluginData('checkUpdating')==='true')
  //   return true
  // return false
  // })
  // toCheckForNodes.forEach((node:SceneNode)=>{
  // })
  function handleSubmit (data:any) {
    if(figma.currentPage.selection.length<2)
      return
    
    const leftNode:SceneNode=figma.currentPage.selection[0]
    const rightNode:SceneNode=figma.currentPage.selection[1]
    leftNode.setPluginData('checkUpdating','true')
    rightNode.setPluginData('checkUpdating','true')
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
    
  function handleArrowUpdating(changedNodeId:string|undefined =''){  
    const toUpdateArrows:SceneNode[] |null =detectAssociatedArrow(changedNodeId)
    if(toUpdateArrows===null)
    return
  for( const toUpdateArrow of toUpdateArrows){
    const nodes:SceneNode[]|null=figma.currentPage.findAll((n:SceneNode)=>{
      if(toUpdateArrow)
      return toUpdateArrow.name.includes(n.id)
      return false
    })
    toUpdateArrow?.remove()
    drawArrowBetweenNodes(nodes[0],nodes[1])
  }
    
  }
  function detectAssociatedArrow(changedNodeId:string|undefined =''){
    const node:SceneNode[]|null = figma.currentPage.findAll(n=>n.name.includes(changedNodeId))
      return node
  }
  // function getAssociatedNode(nodeId:string |undefined){
  //   return figma.currentPage.findOne((n:SceneNode)=>n.id===(nodeId))
  // }

  on('SUBMIT', handleSubmit)
  figma.on("documentchange", (event:DocumentChangeEvent|any) => {
    console.log(event)
    for (const change of event.documentChanges) {
      if(  change.node.getPluginData('checkUpdating') === 'true' &&
      change.type === 'PROPERTY_CHANGE' &&
      ['x', 'y', 'relativeTransform'].some(prop => change.properties.includes(prop))){
                handleArrowUpdating(change.id)  
      }    
      }
    });

 
  showUI({
    height: 500,
    width: 500
  })
}
