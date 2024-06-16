import React, { ReactElement } from "react"
import Image from "next/image"
import terraform from "@/app/_components/logos/terraform.svg"
import aws from "@/app/_components/logos/aws.svg"
import kubernetes from "@/app/_components/logos/kubernetes.svg"

function Logos(): ReactElement {
  return (
    <>
      <div className="bg-gray-50 sm:pt-16">
        <div className="pb-12 bg-white sm:pb-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="rounded-lg bg-white shadow-lg py-8 px-4 grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3">
                  <div className="col-span-1 m-2 flex justify-center md:col-span-3 lg:col-span-1">
                    <a href="https://cdk.tf">
                      <Image
                        alt="Terraform"
                        className="h-24"
                        src={terraform}
                      />
                    </a>
                  </div>
                  <div className="col-span-1 m-2 flex justify-center md:col-span-2 lg:col-span-1">
                    <a href="https://aws.amazon.com/cdk/">
                      <Image
                        alt="AWS"
                        className="h-24"
                        src={aws}
                      />
                    </a>
                  </div>

                  <div className="col-span-1 m-2 flex justify-center md:col-span-3 lg:col-span-1">
                    <a href="https://cdk8s.io">
                      <Image
                        alt="Kubernetes"
                        className="h-24"
                        src={kubernetes}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Logos
