import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo, Show } from "solid-js";
Function(await fetch("https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js").then(r => r.text()))()


export function MyApp() {
  const [files, setFiles] = createSignal<File[]>([])
  const [songId, setSongId] = createSignal(0)
  const actualInfos = useMusicInfo(files)
  onDroppedFile(f => {
    setFiles(files().concat(f))
  })

const song = createMemo(() => files()[songId()])
const songInfo = createMemo(() => actualInfos()[songId()])

  return (
    <div>
      <Show when={files().length}>
        <Show when={actualInfos().length}>
          <DisplayImage file={song()} src={songInfo().img}/>
          <p>{songInfo().tags.album} - {songInfo().tags.artist}</p>
          <p>#{songInfo().tags.track} | {songInfo().tags.genre}, {songInfo().tags.year}</p>
        </Show>
        <PlayAudio url={fileToSrc(song())}/>
      </Show>
      <button onClick={() => setSongId(songId() - 1)}>Prev song</button>
      <button onClick={() => setSongId(songId() + 1)}>Next song</button>
      <aside>
        <For each={actualInfos()}>
          {(info, id) => <p class="link" onClick={() => setSongId(id())}>{info.tags.artist} - {info.tags.title}</p>}
        </For>
      </aside>
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
function useMusicInfo(files: () => File[]) {
  const [infos, setInfos] = createSignal<MusicInfo[]>([])
  createEffect(async () => {
    if(!files().length) return
    const readFiles = []
    for (const file of files()) {
      let onSuccess
      let promise = new Promise(r => onSuccess = r)
      jsmediatags.read(file, { onSuccess })
      readFiles.push(promise)
    }
    const realInfos = (await Promise.all(readFiles))
    for (const info of realInfos) {
      info.img = arrayAsSrc(info.tags.picture.data)
    }
    setInfos(realInfos)
  })
  return infos
}


function arrayAsSrc(array) {
  return (URL.createObjectURL(new Blob([new Uint8Array(array)])))
}
