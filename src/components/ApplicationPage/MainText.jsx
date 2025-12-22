import ArrowSvg from "../../assets/svgs/HearingPage/ArrowSvg";
import WorkingCards from "./WorkingCards";

const MainText = ({ className , onSelectPosition  }) => {
  return (
    <div className={`${className}`}>
      <div>
        <div className="flex md:hidden mb-8 items-center max-h-[60px] ">
          <img src="/LogoMobile.svg" alt="Prime Clinics Logo" />
        </div> 
        <h2 className="text-[28px] sm:text-[40px] md:max-w-full mx-auto font-bold text-[#101828]  leading-[34px] sm:leading-[48px] mb-[12px]">
          Prime Clinics
        </h2>
        <p className="text-[#364153]  sm:text-start text-[14px] sm:text-[16px] font-normal leading-[22px] sm:leading-[29.25px] tracking-[-0.439px]">
          PRIME Clinics is a performance and longevity clinic dedicated to
          optimize health by helping individuals live longer, stronger, and with
          greater quality of life. Our approach combines advanced diagnostic
          testing with personalized, data-driven solutions to optimize health,
          enhance performance, image confidence and support vitality at every
          stage of life. By leading forward-thinking conversations about
          optimization and delivering cutting- edge, evidence-based care, we
          redefine what it means to thrive with strength, clarity, and
          longevity.           
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-[28px] sm:text-[32px] max-w-[300px] md:max-w-full font-bold text-[#101828]  leading-[34px] sm:leading-[48px] ">
          Location
        </h2>
        <p className="text-[#364153]  text-[14px] sm:text-[16px] font-normal leading-[22px] sm:leading-[29.25px] tracking-[-0.439px]">
          PRIME Clinics has established a relationship with Evolve Strength
          Gyms, the first location within Evolve at South Edmonton Common (old
          Nordstrom Rack building). Scheduled Opening Date May 1, 2026.
        </p>
        <p className="text-[#364153] text-[16px] font-medium">
          For inquiries email{" "}
          <a
            href="mailto:lina@primeclinics.ca"
            className="text-[#364153] underline hover:opacity-80 transition"
          >
            lina@primeclinics.ca
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-[28px] sm:text-[32px] max-w-[300px] md:max-w-full font-bold text-[#101828]  leading-[34px] sm:leading-[48px] ">
          Now Hiring
        </h2>
        <div onClick={() => onSelectPosition("nurse_practitioner")} className="flex w-fit bg-white py-[12px] px-[20px] text-[#101828] text-[16px] font-medium items-center rounded-[14px] underline gap-3 hover:bg-white/70 transition cursor-pointer">
          Nurse Practitioner (NP) <span className="max-md:hidden"><ArrowSvg /></span>
        </div>  
 
        <div onClick={() => onSelectPosition("licensed_practical_nurse")} className="bg-white w-fit py-[12px] px-[20px] text-[#101828] text-[16px] font-medium flex items-center rounded-[14px] underline gap-3 hover:bg-white/70 transition cursor-pointer">
          Licensed Practical Nurse (LPN) <span className="max-md:hidden"><ArrowSvg /></span>
        </div>
      </div>
      <div className="mb-12 md:block hidden">
        <h3 className="text-[30px] sm:text-[36px] font-semibold text-[#101828] text-center sm:text-start leading-[36px] sm:l eading-[40px] mb-8">
          Why You'll Love Working Here
        </h3>

        <WorkingCards />
      </div>
    </div>
  );
};

export default MainText;
 