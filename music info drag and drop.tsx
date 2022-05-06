import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo, Show } from "solid-js";
Function(await fetch("https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js").then(r => r.text()))()


function MyApp() {
  const [files, setFiles] = createSignal<File>()
  const actualInfo = useMusicInfo(files)
  onDroppedFile(f => {
    setFiles(f)
  })
  const [src, setSrc] = createSignal("")
  createEffect(()=> {if (actualInfo()) {
    useArrayAsSrc(setSrc, actualInfo().tags.picture.data)
  }})

  return (
    <div>
      <Show when={files()}>
        <Show when={actualInfo()}>
          <DisplayImage file={files()} src={src()}/>
          <p>{actualInfo().tags.album} - {actualInfo().tags.artist}</p>
          <p>#{actualInfo().tags.track} | {actualInfo().tags.genre}, {actualInfo().tags.year}</p>
        </Show>
        <PlayAudio url={fileToSrc(files())}/>
      </Show>
    </div>
  )
}

function DisplayImage(props) {
  return (
    <div>
      <img style="width:300px; height:300px" src={props.src}/>
      <h2>{props.file.name}</h2>
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

type MusicInfo = {
    size: 95607,
    tags: {
        title: string,
        artist: string,
        album: string,
        comment: {
            short_description: string,
            text: string
        },
        track: string,
        genre: string,
        year: string,
        picture: { data: number[] }
    }
}
function useMusicInfo(file: () => File) {
  const [info, onSuccess] = createSignal<MusicInfo>(null)
  createEffect(() => file() && jsmediatags.read(file(), { onSuccess }))
  return info
}


function useArrayAsSrc(setSrc, array) {
  setSrc(URL.createObjectURL(new Blob([new Uint8Array(array)])))
}
