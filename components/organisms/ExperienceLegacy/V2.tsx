
function Experience() {
  function ExperienceItem() {
    return (
      <div className="w-fit justify-center">
        <div className="flex w-[24rem] justify-between">
          <p>Software Engineer (Internship)</p>
          <p>PT. Karya Mitra Utama</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex w-full flex-col items-center justify-center h-96">
      <div>
        <p>Experience</p>
      </div>
      <ExperienceItem />

    </div>
  );
}

export default Experience;