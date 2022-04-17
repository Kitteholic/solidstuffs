import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo } from "solid-js";

function MyApp() {
  const [file, setFile] = createSignal<File>({})
  const [src, setSrc] = createSignal("")
  onDroppedFile(f => {
    setFile(f)
    useFileAsSrc(setSrc, f)
  })

  return (
    <div>
      <p>{file().name}</p>
      <img src={src()} />
    </div>
  )
}

render(() => <MyApp />, document.getElementById("app"));

function useFileAsSrc(setSrc, file) {
  setSrc(URL.createObjectURL(file))
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
