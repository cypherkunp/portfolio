import { Home, Search, Library, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function Sidebar() {
  return (
    <div className="w-60 flex-shrink-0 bg-black border-r border-zinc-800 flex flex-col h-full">
      <div className="p-6">
        <div className="text-2xl font-bold text-white mb-6">
          <svg viewBox="0 0 78 24" height="24" className="fill-white">
            <path d="M18.616 10.429c-3.645-2.161-9.649-2.361-13.134-1.306a1.043 1.043 0 11-.54-2.015c3.98-1.195 10.595-.961 14.762 1.507a1.043 1.043 0 01-1.088 1.814zm-.121 3.256a.87.87 0 01-1.202.261c-3.044-1.873-7.692-2.416-11.305-1.322a.87.87 0 11-.51-1.666c4.115-1.253 9.243-.641 12.756 1.525a.87.87 0 01.261 1.202zm-1.371 3.132a.696.696 0 01-.958.205c-2.661-1.627-6.015-1.994-9.96-1.093a.696.696 0 01-.34-1.349c4.326-1.01 8.035-.592 11.063 1.279a.696.696 0 01.195.958zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"></path>
            <path d="M30.398 14.35v5.483h-1.733V8.055h1.733v5.906h6.379V8.055h1.733v11.778h-1.733V14.35h-6.379zM40.5 15.3c0-2.589 1.733-4.033 4.117-4.033 2.383 0 4.117 1.444 4.117 4.033 0 2.589-1.733 4.033-4.117 4.033-2.383 0-4.117-1.444-4.117-4.033zm6.5 0c0-1.878-1.05-2.75-2.383-2.75-1.333 0-2.383.872-2.383 2.75s1.05 2.75 2.383 2.75c1.333 0 2.383-.872 2.383-2.75zM50.5 19.833V11.5h1.733v8.333H50.5zm.867-9.722a1.04 1.04 0 01-1.05-1.056c0-.6.433-1.055 1.05-1.055.617 0 1.05.455 1.05 1.055 0 .6-.433 1.056-1.05 1.056zM59.804 11.5l-3.684 8.333h-1.842L50.594 11.5h1.842l2.85 6.85 2.85-6.85h1.668zM60.253 15.3c0-2.589 1.733-4.033 4.117-4.033 2.383 0 4.117 1.444 4.117 4.033 0 2.589-1.733 4.033-4.117 4.033-2.383 0-4.117-1.444-4.117-4.033zm6.5 0c0-1.878-1.05-2.75-2.383-2.75-1.333 0-2.383.872-2.383 2.75s1.05 2.75 2.383 2.75c1.333 0 2.383-.872 2.383-2.75zM70.253 15.3c0-2.589 1.733-4.033 4.117-4.033 2.383 0 4.117 1.444 4.117 4.033 0 2.589-1.733 4.033-4.117 4.033-2.383 0-4.117-1.444-4.117-4.033zm6.5 0c0-1.878-1.05-2.75-2.383-2.75-1.333 0-2.383.872-2.383 2.75s1.05 2.75 2.383 2.75c1.333 0 2.383-.872 2.383-2.75z"></path>
          </svg>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
    
        </nav>
      </div>

      <Separator className="bg-zinc-800 my-2" />

      <div className="p-6">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
            <Heart className="mr-2 h-4 w-4" />
            Songs Of AI
          </Button>
        </div>
      </div>

      <Separator className="bg-zinc-800 my-2" />

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-1 py-4">
          <p className="text-xs text-zinc-400 font-medium py-2">PLAYLISTS</p>
          {Array.from({ length: 10 }).map((_, i) => (
            <Button key={i} variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white text-sm h-8">
              My Playlist #{i + 1}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
