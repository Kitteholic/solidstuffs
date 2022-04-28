import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo, Show } from "solid-js";

function MyApp() {
  const [files, setFiles] = createSignal<File[]>([])
  const [latestFile, setLatestFile] = createSignal<File>()
  onDroppedFile(f => {
    setFiles([f].concat(files()))
    if (!latestFile()) {
      setLatestFile(f)
    }
  })

  return (
    <div>
      <For each={files()}>
        {file => <p onClick={() => setLatestFile(file)}>{file.name}</p>}
      </For>
      <Show when={latestFile()}>
        <PlayAudio url={fileToSrc(latestFile())}/>
      </Show>
    </div>
  )
}

function DisplayImage(props) {
  return (
    <div>
      <h2>{props.file.name}</h2>
      <img src={fileToSrc(props.file)}/>
    </div>
  )
}

function PlayAudio(props) {
  return (
    <audio autoplay controls src={props.url}/>
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
