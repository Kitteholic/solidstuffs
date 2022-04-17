import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo } from "solid-js";

function MyApp() {
  const [files, setFiles] = createSignal<File[]>([])
  onDroppedFile(f => {
    setFiles([f].concat(files()))
  })

  return (
    <div>
      <For each={files()}>
        {file => (
          <div>
            <p>{file.name}</p>
            <img src={fileToSrc(file)} />
          </div>
        )}
      </For>
    </div>
  )
}

render(() => <MyApp />, document.getElementById("app"));

function fileToSrc(file) {
  return URL.createObjectURL(file)
}

function onDroppedFile(callback, el = document) {
  el.ondragover = dragevent
  el.ondrop = dragevent
  function dragevent(ev) {
    ev.preventDefault()

    if(!ev.dataTransfer.files.length) return

    callback(ev.dataTransfer.files[0])
  }
}
