import { useGSAP } from "@gsap/react";
import {
  Heart,
  TreePine,
  Users,
  Award,
  ArrowRightCircleIcon,
} from "lucide-react";
import React from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

export const FeaturesSection: React.FC = () => {
  useGSAP(() => {
    const featureHeaderSplit = SplitText.create(".feature-header", {
      type: "words",
    });
    const featureParagraphSplit = SplitText.create(".feature-paragraph", {
      type: "words",
    });

    const featuresTimeline = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".features",
          start: "top 60%",
          end: "bottom 70%",

          scrub: 1,
        },
        defaults: {
          duration: 1,
          yoyo: true,
        },
      })
      .from(featureHeaderSplit.words, {
        opacity: 0,
        y: 100,
        stagger: 0.02,
      })

      .from(featureParagraphSplit.words, {
        opacity: 0,
        y: 100,
        stagger: 0.01,
      })
      .fromTo(
        ".feature-card",
        {
          opacity: 0,
          y: 100,
          ease: "elastic.in",
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "elastic.out",
        }
      );
  }, []);

  const features = [
    {
      icon: Heart,
      title: "Blood Donation",
      description:
        "Save lives by donating blood and track your donations for NSS points.",
      color: "transperent",
    },
    {
      icon: TreePine,
      title: "Tree Tagging",
      description:
        "Contribute to environmental conservation through tree planting and tagging.",
      color: "transparent",
    },
    {
      icon: Users,
      title: "Community Service",
      description:
        "Engage in various community service activities and make a difference.",
      color: "transparent",
    },
    {
      icon: Award,
      title: "Earn Points",
      description:
        "Get recognition for your contributions with our point-based system.",
      color: "transparent",
    },
  ];
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100 features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-isans font-semibold text-gray-900 mb-4 feature-header">
            What You Can Do
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto feature-paragraph">
            Engage in meaningful service activities and track every contribution
            you make through our unified NSS platform.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card group relative bg-white rounded-xl  p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${f.color} shadow-inner mb-5`}
              >
                <f.icon className="h-6 w-6 text-nss-500 group-hover:scale-110 transition-all" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-isans"></h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {f.description}S
              </p>
              <div className="mt-4 flex items-center text-sm p-2 justify-center w-fit rounded-full overflow-hidden   transition-all duration-300 delay-100 ">
                <p className="group-hover:translate-x-0 transition-all duration-300 delay-100 ">
                  Learn more
                </p>
                <ArrowRightCircleIcon className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 translate-x-11 group-hover:translate-x-0 transition-all duration-300 delay-100 text-black " />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
