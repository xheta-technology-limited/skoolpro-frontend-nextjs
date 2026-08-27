type IconProps = React.SVGProps<SVGSVGElement>;

const FilterIcon = (props: IconProps) => {
  return (
    <svg
      {...props}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M7.74757 6.62122L5.85071 4.09375H3.04297C2.5625 4.09375 2.32226 4.67432 2.66259 5.01465L5.25513 7.60719C5.67054 8.02259 6.3462 8.02259 6.7616 7.60719L7.74757 6.62122Z"
        fill="#433E3F"
      />
      <path
        d="M8.96876 4.09375H5.85071L7.74756 6.62122L9.35414 5.01465C9.68946 4.67432 9.44923 4.09375 8.96876 4.09375Z"
        fill="#433E3F"
      />
    </svg>
  );
};

export default FilterIcon;
