import { render } from '@create-figma-plugin/ui'
import { h } from 'preact'
import { Button } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import '!./output.css'

function Plugin () {
  function handleClick () {
    emit('SUBMIT')
  }
    
  return (
    <main>
    <h1 class="text-3xl font-bold underline">
      Hello, World manas here
    </h1>
    <Button onClick={handleClick}>Submit</Button>
    </main>
  )
}

export default render(Plugin)
