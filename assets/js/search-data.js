// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-notes",
          title: "notes",
          description: "short academic notes — math, robotics, control, embedded.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/notes/";
          },
        },{id: "post-your-compiler-39-s-register-problem-is-a-coloring-problem",
        
          title: "Your Compiler&#39;s Register Problem Is a Coloring Problem",
        
        description: "How Chaitin unified register allocation and spilling via graph coloring.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/chaitin-register-allocation/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "notes-welcome-to-the-notes",
          title: 'welcome to the notes',
          description: "what lives here and what doesn&#39;t",
          section: "Notes",handler: () => {
              window.location.href = "/notes/2026-05-13-welcome/";
            },},{id: "projects-zmp-based-humanoid-locomotion",
          title: 'ZMP-Based Humanoid Locomotion',
          description: "Notes on hierarchical QP and torque control for biped stability",
          section: "Projects",handler: () => {
              window.location.href = "/projects/humanoid-locomotion/";
            },},{id: "projects-chaitin-briggs-register-allocation",
          title: 'Chaitin-Briggs Register Allocation',
          description: "Graph-coloring register allocation and spilling strategies",
          section: "Projects",handler: () => {
              window.location.href = "/projects/register-allocation/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%6F%73%65.%73%69%6C%76%61%61%32%30%34%39@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/jssilvaa", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/jssilvaa", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
