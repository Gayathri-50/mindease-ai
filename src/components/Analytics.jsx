import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function Analytics() {

const [mood,setMood]=useState("😊")

const moodStats={

"😊":{
score:92,
focus:240,
progress:85
},

"😌":{
score:78,
focus:190,
progress:72
},

"😔":{
score:52,
focus:90,
progress:45
},

"😣":{
score:34,
focus:60,
progress:28
},

"😴":{
score:64,
focus:120,
progress:58
}

}

useEffect(()=>{

const loadMood=()=>{

const saved=

localStorage.getItem(
"selectedMood"
)

if(saved){

setMood(saved)

}

}

loadMood()

const interval=

setInterval(
loadMood,
500
)

return()=>

clearInterval(
interval
)

},[])

const current=

moodStats[mood]

return(

<motion.div

initial={{
opacity:0
}}

animate={{
opacity:1
}}

className="
glass
glow
rounded-3xl
p-8
"

>

<div
className="
flex
justify-between
mb-8
"
>

<div>

<h2
className="
text-4xl
font-bold
"
>

Analytics 📊

</h2>

<p
className="
text-gray-400
mt-2
"
>

Live mood insights

</p>

</div>

<div
className="
text-5xl
"
>

{

mood

}

</div>

</div>

<div
className="
grid
grid-cols-2
gap-5
"
>

<div
className="
bg-white/5
p-6
rounded-3xl
"
>

<p>

Mood Score

</p>

<h1
className="
text-5xl
mt-3
"
>

{

current.score

}

%

</h1>

</div>

<div
className="
bg-white/5
p-6
rounded-3xl
"
>

<p>

Focus

</p>

<h1
className="
text-5xl
mt-3
"
>

{

current.focus

}

m

</h1>

</div>

</div>

<div className="mt-10">

<p className="mb-3">

Progress

</p>

<div
className="
h-4
rounded-full
bg-white/10
overflow-hidden
"
>

<div

style={{

width:
`${current.progress}%`

}}

className="
h-full
bg-gradient-to-r
from-purple-500
to-pink-500
"

>

</div>

</div>

<p
className="
mt-3
text-gray-300
"
>

{

current.progress

}

% Completed

</p>

</div>

</motion.div>

)

}

export default Analytics