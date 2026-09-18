import { InteractiveListItem } from "@/components/InteractiveListItem";
import { DitherShaderCanvas } from "@/components/DitherShaderCanvas";

export default function Home() {
  return (
    <div className="bg-white min-h-screen w-full flex flex-col items-center">
      <main className="flex flex-col lg:flex-row flex-1 w-full gap-[60px] p-[20px] sm:p-[40px] items-stretch justify-between">
        {/* Left Column */}
        <div className="flex flex-col justify-between w-full lg:w-[700px] shrink-0 min-h-[calc(100vh-80px)] py-2">
          {/* Top Nav */}
          <nav className="flex items-center gap-[32px] text-[13px] font-sans text-[#111111] font-normal tracking-wide uppercase">
            <a href="#about" className="no-underline hover:opacity-60 transition-opacity">
              ABOUT
            </a>
            <a href="#archive" className="no-underline hover:opacity-60 transition-opacity">
              ARCHIVE
            </a>
          </nav>

          {/* Main Heading Block */}
          <div className="my-8 lg:my-0">
            <h1 className="font-sans font-normal text-[#111111] text-[48px] sm:text-[72px] lg:text-[96px] leading-[0.95] lg:leading-[90px] tracking-tight uppercase max-w-[700px] select-none">
              SUPERFLAT STUDIO BUILDS THINGS THAT INFER MEANING
            </h1>
          </div>

          {/* Projects and Products Sections */}
          <div className="flex flex-col w-full gap-[48px]">
            {/* Projects Section */}
            <section className="flex flex-col gap-[8px] w-full">
              <h2 className="font-sans font-medium text-[32px] text-[#111111] leading-none">
                Projects
              </h2>
              <div className="flex flex-col gap-[4px] w-full pt-[8px]">
                <InteractiveListItem title="Papal Papers" />
                <InteractiveListItem title="Lankan Airlines Temporal Graph" />
                <InteractiveListItem title="Fake Images, Unfake News" />
              </div>
            </section>

            {/* Products Section */}
            <section className="flex flex-col gap-[8px] w-full">
              <h2 className="font-sans font-medium text-[32px] text-[#111111] leading-none">
                Products
              </h2>
              <div className="flex flex-col gap-[4px] w-full pt-[8px]">
                <InteractiveListItem title="System 2" />
                <InteractiveListItem title="Boom" />
              </div>
            </section>
          </div>
        </div>

        {/* Right Column Shader Canvas */}
        <div className="flex-1 w-full min-h-[450px] lg:min-h-0 lg:h-[calc(100vh-80px)]">
          <DitherShaderCanvas />
        </div>
      </main>
    </div>
  );
}
