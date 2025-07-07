import { Calendar } from "lucide-react";
import MindTrainerAbout from "./MindTrainerAbout";
import NavBar from "./navbar";
import ServicesSection from "./services";
import PricingSection from "./pricing";
import MentalHealthServices from "./mentalhealthService";
import Web3MindsHero from "./webMindHero";
import MentalHealthHero from "./chooseUs";
import CalmLedgerTestimonials from "./testimonials";
import Footer from "./footer";

const Hero = () => {
    return (<>
        <NavBar />
         <div 
            className="w-full h-[50vh] sm:h-[50vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh] bg-amber-50 flex justify-center items-center" 
            style={{
                backgroundImage: "url(/img4.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="w-full h-full flex items-center bg-black/40">
                <div className="w-full px-4 mt-20 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 flex flex-col justify-center">
                    {/* Main Heading */}
                    <h1 className="font-sans text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold uppecase leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight">
                        Calm Your{" "}
                        <span className="">
                            Web3
                        </span>{" "}
                        Mind
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-300 pt-2 sm:pt-6 md:pt-8 lg:pt-10 xl:pt-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-sans leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed xl:leading-relaxed max-w-none sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
                        Your mental health is the foundation of your innovation.{" "}
                        <br className="hidden sm:block" />
                        Let us help you build it strong.
                    </p>

                    {/* CTA Button */}
                    <div className="pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-16">
                        <button className="group p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 bg-[#044341] hover:bg-blue-800 transition-all duration-300 uppercase flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 items-center text-white font-bold cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl rounded-sm sm:rounded md:rounded-md lg:rounded-lg transform hover:scale-105 hover:shadow-lg active:scale-95">
                            Book a session 
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 group-hover:rotate-12 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/* <MentalHealthServices/> */}
        <MindTrainerAbout/>
        <Web3MindsHero/>
        <ServicesSection/>
        <MentalHealthHero/>
        <CalmLedgerTestimonials/>
        <Footer/>

    </>);
}

export default Hero;