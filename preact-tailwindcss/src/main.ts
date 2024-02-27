import {showUI } from '@create-figma-plugin/utilities'
import {on,emit} from '@create-figma-plugin/utilities'
export default function () {

  function handleSubmit (data:any) {
    const rectangle = figma.createRectangle();

    rectangle.resize(200, 100);
    
    rectangle.x = 100;
    rectangle.y = 100;
    
    rectangle.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
    
    figma.currentPage.appendChild(rectangle);  
  }

  on('SUBMIT', handleSubmit)

  showUI({
    height: 500,
    width: 500
  })
}
