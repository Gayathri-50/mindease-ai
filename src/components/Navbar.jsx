import { motion } from "framer-motion"

function Navbar() {

return (

<motion.div

initial={{
opacity:0,
y:-20
}}

animate={{
opacity:1,
y:0
}}

className="
glass
glow
rounded-3xl
px-8
py-5
flex
justify-between
items-center
mb-8
"

>

<div>

<h1
className="
text-3xl
font-bold
bg-gradient-to-r
from-purple-400
to-pink-400
bg-clip-text
text-transparent
"
>

MindEase

</h1>

<p
className="
text-gray-400
mt-1
"
>

AI Wellness Dashboard

</p>

</div>

<div
className="
flex
gap-3
"
>

<button
className="
bg-white/10
px-5
py-2
rounded-2xl
"
>

Home

</button>

<button
className="
bg-white/10
px-5
py-2
rounded-2xl
"
>

Journal

</button>

<button
className="
bg-gradient-to-r
from-purple-600
to-pink-500
px-5
py-2
rounded-2xl
"
>

Profile

</button>

</div>

</motion.div>

)

}

export default Navbar