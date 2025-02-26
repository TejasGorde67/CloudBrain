import logo from "../assets/brain.png";
import gitlogo from "../assets/github.png";
import xlogo from "../assets/twitter.png";
import inlogo from "../assets/linkedin.png";

export const Footer = () => {
  return (
    <div className="p-4 md:p-6 font-poppins border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#0D1117] transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex items-center">
          <img
            src={logo}
            alt="CloudBrain Logo"
            className="w-6 md:w-[30px] dark:filter dark:brightness-110"
          />
          <p className="pl-2 text-base md:text-xl tracking-tight text-gray-800 dark:text-neutral-200">
            CloudBrain{" "}
            <span className="block md:inline text-center md:text-left">
              by
              <a
                className="pl-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                
              >
                Tejas
              </a>
            </span>
          </p>
        </div>
       
      </div>
    </div>
  );
};

export default Footer;
