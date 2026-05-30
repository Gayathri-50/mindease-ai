import { useState, useEffect } from "react"
import { motion } from "framer-motion"

function Journal() {

const [text,setText]=useState("")
const [entries,setEntries]=useState([])
const [editingId,setEditingId]=useState(null)
const [search,setSearch]=useState("")

useEffect(()=>{

const saved=

JSON.parse(

localStorage.getItem(
"journalEntries"
)

)

if(saved){

setEntries(saved)

}

},[])

const saveJournal=()=>{

if(

text.trim()===""

)

return

if(editingId){

const updated=

entries.map(

(entry)=>

entry.id===editingId

?

{

...entry,

content:text

}

:

entry

)

setEntries(updated)

localStorage.setItem(

"journalEntries",

JSON.stringify(
updated
)

)

setEditingId(null)

}

else{

const newEntry={

id:Date.now(),

content:text,

date:
new Date()
.toLocaleDateString(),

time:
new Date()
.toLocaleTimeString()

}

const updated=[

newEntry,

...entries

]

setEntries(updated)

localStorage.setItem(

"journalEntries",

JSON.stringify(
updated
)

)

}

setText("")

}

const deleteEntry=(id)=>{

const updated=

entries.filter(

entry=>

entry.id!==id

)

setEntries(updated)

localStorage.setItem(

"journalEntries",

JSON.stringify(
updated
)

)

}

const editEntry=(entry)=>{

setText(
entry.content
)

setEditingId(
entry.id
)

}

const filtered=

entries.filter(

(entry)=>

entry.content

.toLowerCase()

.includes(

search

.toLowerCase()

)

)

return(

<motion.div

initial={{
opacity:0,
y:40
}}

animate={{
opacity:1,
y:0
}}

className="
glass
glow
mt-10
p-8
rounded-3xl
"

>

<div
className="
flex
justify-between
items-center
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

Personal Journal ✍️

</h2>

<p
className="
text-gray-400
mt-2
"
>

Capture your daily thoughts

</p>

</div>

<div
className="
hidden
md:flex
"
>

<div
className="
bg-white/10
px-5
py-3
rounded-2xl
"
>

📝 Journal

</div>

</div>

</div>

<input

type="text"

placeholder="
Search journal...
"

value={search}

onChange={(e)=>

setSearch(
e.target.value
)

}

className="
w-full
mb-5
bg-white/5
border
border-white/10
rounded-2xl
p-5
outline-none
"

>

</input>

<textarea

value={text}

onChange={(e)=>

setText(
e.target.value
)

}

placeholder="
Write something meaningful...
"

className="
w-full
h-40
bg-white/5
border
border-white/10
rounded-2xl
p-5
outline-none
"

>

</textarea>

<div
className="
flex
justify-end
mt-5
"
>

<button

onClick={
saveJournal
}

className="
bg-gradient-to-r
from-purple-600
to-pink-500
px-8
py-3
rounded-2xl
font-semibold
"

>

{

editingId

?

"Update ✏️"

:

"Save 🚀"

}

</button>

</div>

<div
className="
mt-10
space-y-6
"
>

{

filtered.length===0

?

(

<div
className="
text-center
text-gray-400
"
>

No entries

</div>

)

:

(

filtered.map(

(entry)=>(

<div

key={
entry.id
}

className="
glass
glow
p-6
rounded-3xl
"

>

<div
className="
flex
justify-between
mb-4
"
>

<p
className="
text-purple-400
"
>

{

entry.date

}

</p>

<p
className="
text-gray-400
"
>

{

entry.time

}

</p>

</div>

<p
className="
whitespace-pre-wrap
"
>

{

entry.content

}

</p>

<div
className="
flex
justify-end
gap-3
mt-5
"
>

<button

onClick={()=>

editEntry(
entry
)

}

className="
bg-gradient-to-r
from-cyan-500
to-blue-600
px-4
py-2
rounded-xl
"

>

Edit

</button>

<button

onClick={()=>

deleteEntry(
entry.id
)

}

className="
bg-gradient-to-r
from-red-500
to-pink-600
px-4
py-2
rounded-xl
"

>

Delete

</button>

</div>

</div>

)

)

)

}

</div>

</motion.div>

)

}

export default Journal