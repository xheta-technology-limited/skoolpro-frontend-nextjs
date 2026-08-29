import clsx from "clsx";

type IconProps = {
  title?: string;
  subTitle?: string;
} & React.SVGProps<SVGSVGElement>;

const NoDataWrapper = ({
  title,
  subTitle,
  className,
  ...props
}: IconProps & { className?: string }) => {
  return (
    <div
      className={clsx(
        "relative h-71.75 md:h-143.75 md:w-97.5 w-48.75 overflow-hidden bg-contain bg-no-repeat",
        className
      )}
    >
      {title && (
        <div
          className={clsx(
            "absolute inset-x-0 top-[57%] w-full text-center sm:px-8"
          )}
        >
          <p className="m-0 text-[1.75rem] font-bold leading-[1.2] break-words text-black">
            {title}
          </p>
          <p className="m-0 text-[1.125rem] font-medium leading-[1.2] break-words text-[#9E9E9E]">
            {subTitle}
          </p>
        </div>
      )}
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
        {...props}
        viewBox="0 0 474 659"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_6170_65622)">
          <rect x="21" y="15" width="390" height="575" rx="35" fill="#FCFDFF" />
          <g filter="url(#filter1_f_6170_65622)">
            <ellipse
              cx="214.486"
              cy="271.812"
              rx="110.607"
              ry="21.3375"
              fill="#1F88F8"
              fillOpacity="0.35"
            />
          </g>
          <path
            d="M215.701 314.402C279.049 314.402 330.402 263.049 330.402 199.701C330.402 136.353 279.049 85 215.701 85C152.353 85 101 136.353 101 199.701C101 263.049 152.353 314.402 215.701 314.402Z"
            fill="url(#paint0_linear_6170_65622)"
          />
          <g filter="url(#filter2_d_6170_65622)">
            <path
              d="M311.783 162.624L213.492 231.219L115.201 162.624L205.179 99.8054C207.619 98.1047 210.522 97.1929 213.496 97.1929C216.47 97.1929 219.373 98.1047 221.813 99.8054L239.762 112.353L244.461 115.616L291.779 148.657L296.763 152.157L311.783 162.624Z"
              fill="url(#paint1_linear_6170_65622)"
            />
          </g>
          <path
            d="M197.51 220.066L115.201 278.594V162.624L197.51 220.066Z"
            fill="url(#paint2_linear_6170_65622)"
          />
          <g filter="url(#filter3_f_6170_65622)">
            <ellipse
              cx="261.515"
              cy="160.335"
              rx="36.5786"
              ry="11.7574"
              fill="#FF4C77"
              fillOpacity="0.3"
            />
          </g>
          <path
            d="M229.481 220.066L311.79 278.594V162.624L229.481 220.066Z"
            fill="url(#paint3_linear_6170_65622)"
          />
          <path
            d="M115.201 278.594L205.073 214.699C207.532 212.947 210.477 212.006 213.496 212.006C216.515 212.006 219.46 212.947 221.919 214.699L311.783 278.594H115.201Z"
            fill="url(#paint4_linear_6170_65622)"
          />
          <path
            d="M263.207 153.14C265.951 153.14 267.867 151.268 267.867 148.655C267.867 146.041 265.951 144.169 263.207 144.169C260.507 144.169 258.547 146.041 258.547 148.655C258.547 151.268 260.507 153.14 263.207 153.14ZM266.952 142.557C266.952 139.509 268.433 138.333 270.698 137.157C273.746 135.589 276.011 133.019 276.011 129.361C276.011 123.917 270.829 120.084 263.904 120.084C256.587 120.084 251.361 124.396 250.838 130.45L259.244 131.974C259.549 129.187 261.204 127.14 263.555 127.14C265.428 127.14 266.865 128.446 266.865 130.232C266.865 132.018 265.254 133.019 263.86 133.934C260.812 135.937 259.505 138.202 259.505 142.557H266.952Z"
            fill="white"
          />
          <g filter="url(#filter4_d_6170_65622)">
            <path
              d="M125.586 141.61C110.518 148.659 94.325 152.998 77.751 154.428C79.9905 159.634 95.9028 185.693 143.139 207.165C144.416 207.361 173.912 193.639 190.1 184.229C189.55 185.015 139.819 166.716 125.586 141.61Z"
              fill="url(#paint5_linear_6170_65622)"
            />
          </g>
          <path
            d="M262.645 170.13C280.758 170.13 295.441 155.446 295.441 137.333C295.441 119.22 280.758 104.537 262.645 104.537C244.532 104.537 229.849 119.22 229.849 137.333C229.849 155.446 244.532 170.13 262.645 170.13Z"
            fill="url(#paint6_linear_6170_65622)"
          />
          <path
            d="M262.339 156.869C265.837 156.869 268.28 154.482 268.28 151.15C268.28 147.819 265.837 145.432 262.339 145.432C258.897 145.432 256.398 147.819 256.398 151.15C256.398 154.482 258.897 156.869 262.339 156.869ZM267.114 143.377C267.114 139.491 269.002 137.992 271.889 136.493C275.775 134.494 278.662 131.218 278.662 126.554C278.662 119.614 272.055 114.728 263.228 114.728C253.9 114.728 247.237 120.225 246.571 127.942L257.287 129.886C257.675 126.332 259.785 123.723 262.783 123.723C265.171 123.723 267.003 125.389 267.003 127.665C267.003 129.941 264.949 131.218 263.172 132.384C259.286 134.938 257.62 137.825 257.62 143.377H267.114Z"
            fill="white"
          />
          <path
            d="M126.752 154.566C126.058 154.085 125.18 153.955 124.377 154.215L98.013 162.744C97.0686 163.05 96.7321 164.213 97.3676 164.976C97.8793 165.59 98.7169 165.824 99.4731 165.565L126.51 156.305C127.273 156.044 127.414 155.026 126.752 154.566Z"
            fill="#C9DFFF"
          />
          <path
            d="M126.296 165.071C125.627 164.443 124.667 164.234 123.798 164.527L105.546 170.669C104.742 170.94 104.457 171.933 104.997 172.588C105.438 173.124 106.165 173.331 106.821 173.107L125.968 166.588C126.614 166.368 126.793 165.539 126.296 165.071Z"
            fill="#C9DFFF"
          />
          <path
            d="M136.092 170.273C135.394 169.714 134.455 169.56 133.615 169.865L112.592 177.506C111.767 177.806 111.518 178.853 112.121 179.491C112.582 179.98 113.29 180.146 113.92 179.915L135.83 171.875C136.512 171.625 136.658 170.727 136.092 170.273Z"
            fill="#C9DFFF"
          />
          <path
            d="M143.442 186.044C142.795 185.33 141.777 185.086 140.877 185.429L128.862 190.014C128.124 190.295 127.858 191.203 128.327 191.838C128.767 192.434 129.55 192.661 130.24 192.394L143.119 187.406C143.674 187.191 143.841 186.486 143.442 186.044Z"
            fill="#C9DFFF"
          />
          <g filter="url(#filter5_d_6170_65622)">
            <path
              d="M299.77 177.951C318.042 186.498 337.676 191.759 357.773 193.494C355.058 199.806 335.763 231.404 278.487 257.44C276.939 257.678 241.172 241.039 221.544 229.629C222.211 230.582 282.512 208.393 299.77 177.951Z"
              fill="url(#paint7_linear_6170_65622)"
            />
          </g>
          <path
            d="M298.357 193.661C299.198 193.078 300.263 192.92 301.237 193.235L333.205 203.578C334.35 203.948 334.758 205.359 333.987 206.284C333.367 207.028 332.351 207.313 331.434 206.998L298.651 195.77C297.726 195.453 297.554 194.219 298.357 193.661Z"
            fill="#C9DFFF"
          />
          <path
            d="M289.406 202.175C290.217 201.413 291.38 201.16 292.435 201.514L314.565 208.962C315.541 209.291 315.886 210.495 315.231 211.29C314.697 211.939 313.816 212.19 313.02 211.919L289.803 204.014C289.02 203.747 288.802 202.741 289.406 202.175Z"
            fill="#C9DFFF"
          />
          <path
            d="M280.207 209.242C281.054 208.565 282.192 208.377 283.21 208.747L308.702 218.012C309.703 218.376 310.004 219.645 309.273 220.42C308.715 221.012 307.856 221.214 307.092 220.934L280.524 211.184C279.699 210.881 279.521 209.792 280.207 209.242Z"
            fill="#C9DFFF"
          />
          <path
            d="M259.51 223.382C260.294 222.515 261.529 222.219 262.62 222.636L277.189 228.195C278.084 228.536 278.406 229.637 277.837 230.407C277.304 231.129 276.354 231.405 275.518 231.081L259.902 225.033C259.229 224.772 259.026 223.917 259.51 223.382Z"
            fill="#C9DFFF"
          />
          <path
            d="M269.02 215.831C269.882 215.29 270.946 215.178 271.902 215.528L305.47 227.801C306.543 228.193 306.803 229.592 305.943 230.344C305.374 230.841 304.579 230.987 303.87 230.726L269.242 217.97C268.309 217.626 268.177 216.36 269.02 215.831Z"
            fill="#C9DFFF"
          />
          <path
            d="M150.712 173.72C150.001 173.274 149.123 173.182 148.335 173.47L120.651 183.592C119.767 183.915 119.552 185.069 120.262 185.689C120.731 186.099 121.387 186.22 121.971 186.004L150.529 175.484C151.299 175.201 151.407 174.156 150.712 173.72Z"
            fill="#C9DFFF"
          />
          <path
            d="M305.933 107.208C308.578 107.209 310.723 109.353 310.723 111.999C310.723 114.644 308.578 116.788 305.933 116.789C303.287 116.789 301.143 114.644 301.143 111.999C301.143 109.353 303.287 107.208 305.933 107.208Z"
            stroke="url(#paint8_linear_6170_65622)"
            strokeWidth="2.61276"
          />
          <circle
            cx="136.102"
            cy="289.666"
            r="4.79006"
            stroke="url(#paint9_linear_6170_65622)"
            strokeWidth="2.61276"
          />
          <circle
            cx="283.288"
            cy="299.246"
            r="4.79006"
            stroke="url(#paint10_linear_6170_65622)"
            strokeWidth="2.61276"
          />
          <path
            d="M152.36 116.932C152.875 114.799 155.909 114.799 156.424 116.932L158.157 124.111C158.341 124.873 158.936 125.468 159.698 125.652L166.877 127.385C169.01 127.9 169.01 130.934 166.877 131.449L159.698 133.181C158.936 133.365 158.341 133.961 158.157 134.723L156.424 141.902C155.909 144.035 152.875 144.035 152.36 141.902L150.628 134.723C150.444 133.961 149.848 133.365 149.086 133.181L141.907 131.449C139.774 130.934 139.774 127.9 141.907 127.385L149.086 125.652C149.848 125.468 150.444 124.873 150.628 124.111L152.36 116.932Z"
            fill="url(#paint11_linear_6170_65622)"
          />
          <path
            d="M326.87 268.417C327.385 266.284 330.419 266.284 330.934 268.417L332.667 275.596C332.851 276.358 333.446 276.953 334.208 277.137L341.387 278.87C343.52 279.385 343.52 282.419 341.387 282.934L334.208 284.667C333.446 284.851 332.851 285.446 332.667 286.208L330.934 293.387C330.419 295.52 327.385 295.52 326.87 293.387L325.137 286.208C324.953 285.446 324.358 284.851 323.596 284.667L316.417 282.934C314.284 282.419 314.284 279.385 316.417 278.87L323.596 277.137C324.358 276.953 324.953 276.358 325.137 275.596L326.87 268.417Z"
            fill="url(#paint12_linear_6170_65622)"
          />
          <path
            d="M104.234 251.614C105.558 251.402 106.615 252.703 106.137 253.956L102.908 262.411C102.429 263.664 100.774 263.929 99.9288 262.888L94.2208 255.864C93.3752 254.823 93.9732 253.258 95.2972 253.046L104.234 251.614Z"
            fill="url(#paint13_linear_6170_65622)"
          />
          <path
            d="M330.329 165.422C329.997 164.123 331.197 162.952 332.488 163.315L341.201 165.763C342.492 166.126 342.906 167.75 341.946 168.687L335.469 175.008C334.51 175.945 332.896 175.491 332.565 174.192L330.329 165.422Z"
            fill="url(#paint14_linear_6170_65622)"
          />
          <g filter="url(#filter6_f_6170_65622)">
            <ellipse
              cx="214"
              cy="520.5"
              rx="76"
              ry="16.5"
              fill="#1F88F8"
              fillOpacity="0.35"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_6170_65622"
            x="0"
            y="0"
            width="474"
            height="659"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="8"
              operator="erode"
              in="SourceAlpha"
              result="effect1_dropShadow_6170_65622"
            />
            <feOffset dx="21" dy="27" />
            <feGaussianBlur stdDeviation="25" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.833333 0 0 0 0 0.697917 0 0 0 0 0.697917 0 0 0 0.17 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_6170_65622"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_6170_65622"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_f_6170_65622"
            x="82.1059"
            y="228.702"
            width="264.76"
            height="86.2213"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="10.8865"
              result="effect1_foregroundBlur_6170_65622"
            />
          </filter>
          <filter
            id="filter2_d_6170_65622"
            x="111.717"
            y="97.1929"
            width="203.549"
            height="140.993"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="3.48368" />
            <feGaussianBlur stdDeviation="1.74184" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_6170_65622"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_6170_65622"
              result="shape"
            />
          </filter>
          <filter
            id="filter3_f_6170_65622"
            x="203.164"
            y="126.804"
            width="116.703"
            height="67.0606"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="10.8865"
              result="effect1_foregroundBlur_6170_65622"
            />
          </filter>
          <filter
            id="filter4_d_6170_65622"
            x="67.2999"
            y="134.643"
            width="133.251"
            height="86.4587"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="3.48368" />
            <feGaussianBlur stdDeviation="5.22552" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0196078 0 0 0 0 0.168627 0 0 0 0 0.396078 0 0 0 0.15 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_6170_65622"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_6170_65622"
              result="shape"
            />
          </filter>
          <filter
            id="filter5_d_6170_65622"
            x="201.458"
            y="176.209"
            width="165.841"
            height="109.103"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-5.28021" dy="13.0638" />
            <feGaussianBlur stdDeviation="7.40282" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.021441 0 0 0 0 0.168056 0 0 0 0 0.395833 0 0 0 0.15 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_6170_65622"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_6170_65622"
              result="shape"
            />
          </filter>
          <filter
            id="filter6_f_6170_65622"
            x="113"
            y="479"
            width="202"
            height="83"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="12.5"
              result="effect1_foregroundBlur_6170_65622"
            />
          </filter>
          <linearGradient
            id="paint0_linear_6170_65622"
            x1="214.817"
            y1="47.6505"
            x2="217.167"
            y2="450.463"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#CAE0FF" stopOpacity="0" />
            <stop offset="1" stopColor="#BCD8FF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_6170_65622"
            x1="213.492"
            y1="97.1929"
            x2="213.492"
            y2="231.219"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EDF4FF" />
            <stop offset="1" stopColor="#ABCCFF" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_6170_65622"
            x1="156.356"
            y1="162.624"
            x2="156.356"
            y2="278.594"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ABCCFF" />
            <stop offset="1" stopColor="#70A8FF" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_6170_65622"
            x1="270.636"
            y1="162.624"
            x2="270.636"
            y2="278.594"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ABCCFF" />
            <stop offset="1" stopColor="#70A8FF" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_6170_65622"
            x1="213.492"
            y1="212.006"
            x2="213.492"
            y2="278.594"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#70A8FF" />
            <stop offset="1" stopColor="#5597FD" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_6170_65622"
            x1="89.9438"
            y1="170.786"
            x2="163.537"
            y2="156.415"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#C6DDFF" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_6170_65622"
            x1="230.162"
            y1="108.95"
            x2="295.481"
            y2="170.35"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF698D" />
            <stop offset="1" stopColor="#FF3868" />
          </linearGradient>
          <linearGradient
            id="paint7_linear_6170_65622"
            x1="342.989"
            y1="213.328"
            x2="253.753"
            y2="195.903"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#C6DDFF" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint8_linear_6170_65622"
            x1="298.439"
            y1="108.188"
            x2="317.49"
            y2="124.699"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#94BFFF" />
            <stop offset="1" stopColor="#4C94FE" />
          </linearGradient>
          <linearGradient
            id="paint9_linear_6170_65622"
            x1="128.609"
            y1="285.856"
            x2="147.66"
            y2="302.367"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#94BFFF" />
            <stop offset="1" stopColor="#4C94FE" />
          </linearGradient>
          <linearGradient
            id="paint10_linear_6170_65622"
            x1="275.794"
            y1="295.436"
            x2="294.846"
            y2="311.947"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#94BFFF" />
            <stop offset="1" stopColor="#4C94FE" />
          </linearGradient>
          <linearGradient
            id="paint11_linear_6170_65622"
            x1="154.392"
            y1="108.515"
            x2="154.392"
            y2="150.319"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#70A8FF" />
            <stop offset="1" stopColor="#5597FD" />
          </linearGradient>
          <linearGradient
            id="paint12_linear_6170_65622"
            x1="328.902"
            y1="260"
            x2="328.902"
            y2="301.804"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#70A8FF" />
            <stop offset="1" stopColor="#5597FD" />
          </linearGradient>
          <linearGradient
            id="paint13_linear_6170_65622"
            x1="107.213"
            y1="251.137"
            x2="93.6954"
            y2="262.122"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#70A8FF" />
            <stop offset="1" stopColor="#5597FD" />
          </linearGradient>
          <linearGradient
            id="paint14_linear_6170_65622"
            x1="329.583"
            y1="162.498"
            x2="341.749"
            y2="174.964"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#70A8FF" />
            <stop offset="1" stopColor="#5597FD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default NoDataWrapper;
