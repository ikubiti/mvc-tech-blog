
module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  format_date_full: (date) => {
    return date.toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" });
  },
  getUpdatedTime: (dateCreated, dateUpdated) => {
    if (dateCreated.getDay() != dateUpdated.getDay() || dateCreated.getMonth() != dateUpdated.getMonth() || dateCreated.getFullYear() != dateUpdated.getFullYear()) {
      let displayDate = dateUpdated.toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" });
      return `Updated on ${displayDate}`;

    }

    return '';

  },
  addClass: (element) => {
    if (!element || element === '') {
      return "";
    }

    return 'blogHeadImage';
  },
  initiateCarousel: (element) => {
    if (element === 0) {
      return `class="active" aria-current="true"`;
    }

    return "";
  },
  getActive: (element) => {
    if (element === 0) {
      return "active"; 970;
    }

    return "";
  },
  getCarouselImage: (element, alt) => {
    if (!element || element === '') {
      return `<svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>`;
    }

    return `<img src="${element}" alt="${alt}" class="carolImage" aria-hidden="true">`;
  },
  getTextStart: (element) => {
    if (element === 0) {
      return "text-start";
    }

    return "";
  },
  addOne: (element) => {
    return parseInt(element) + 1;
  }
};
