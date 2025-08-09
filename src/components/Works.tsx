type WorkItem = {
    title: string;
    description: string;
    image: string;
};

const workItems: WorkItem[] = [
    {
        title: "Art Therapy",
        description:
            "Watch self-expression become healing — one brushstroke at a time.",
        image: "/images/works/drawing.webp",
    },
    {
        title: "Education Outreach",
        description:
            "From forgotten corners to open books — learning finds a way.",
        image: "/images/works/play.webp",
    },
    {
        title: "Play and Learn",
        description: "See curiosity bloom where play meets purpose.",
        image: "/images/works/tree.webp",
    },
];


const Works: React.FC = () => {
    return (
        <div
            className="min-h-screen w-full flex flex-col items-center bg-teal-50 p-5 pt-24"
            id="mission"
        >
            <div className="text-center mb-12">
                <h3 className="text-xl md:text-2xl font-semibold text-teal-900">
                    why?
                </h3>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-lg">
                    See What Choosing Change Looks Like.
                </h1>
            </div>

            <div className="flex flex-1 w-full max-w-6xl gap-4 h-[400px]">
                {workItems.map((item, index) => (
                    <div
                        key={index}
                        className={`relative flex-1 rounded-xl overflow-hidden shadow-md border border-teal-700 group transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                            index === 2 ? "hidden md:block" : ""
                        }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:brightness-120"
                            style={{ backgroundImage: `url(${item.image})` }}
                        />

                        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

                        <div className="relative z-20 flex flex-col justify-center drop-shadow-lg items-center text-center h-full mt-[50%] text-white px-4">
                            <h2 className="text-2xl font-bold mb-2 text-teal-400">
                                {item.title}
                            </h2>
                            <p className="text-sm ">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Works;
