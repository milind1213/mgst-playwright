import { test, expect, response } from "@playwright/test";

test.skip("API Test with mock response", async ({ request }) => {
  const response = {
    status: "success",
    meta: {
      version: "1.0",
      timestamp: "2025-08-25T12:30:00Z",
      requestId: "abc-123-xyz",
    },
    data: {
      Resources: [
        {
          name: "MGS Milind",
          username: "mghongade",
          id: "1234",
          active: true,
          email: "abc@gmail.com",
          address: {
            city: "Pune",
            zipcode: "411001",
            coordinates: {
              lat: 18.5204,
              lng: 73.8567,
            },
          },
          roles: ["admin", "tester"],
          projects: [
            {
              projectId: "P001",
              name: "Automation Framework",
              status: "ongoing",
              technologies: ["Playwright", "Java", "Docker"],
              tasks: [
                { taskId: "T001", title: "Setup framework", completed: true },
                { taskId: "T002", title: "Write API tests", completed: true },
              ],
            },
          ],
        },
        {
          name: "Nikhil Sharma",
          username: "nsharma",
          id: "5678",
          active: false,
          email: "xyz@gmail.com",
          address: {
            city: "Mumbai",
            zipcode: "400001",
            coordinates: {
              lat: 19.076,
              lng: 72.8777,
            },
          },
          roles: ["developer"],
          projects: [
            {
              projectId: "P002",
              name: "E-commerce Platform",
              status: "completed",
              technologies: ["React", "Node.js"],
              tasks: [
                { taskId: "T010", title: "Build UI", completed: true },
                { taskId: "T011", title: "Integrate APIs", completed: true },
              ],
            },
          ],
        },
      ],
    },
    count: 2,
  };

  expect(response.status).toBe("success");
  expect(response.meta.requestId).toBe("abc-123-xyz");

  const techsP001 = response.data.Resources[0].projects[0].technologies;
  expect(techsP001).toContain("Playwright");

  let alltechnoliges = [];
  let completedTaskiD = [];
  for (let resorce of response.data.Resources) {
    console.log("ResoucerName : ", resorce.name);

    for (let project of resorce.projects) {
      for (let task of project.tasks) {
        if (task.completed === true) {
          completedTaskiD.push(task.taskId);
        }
      }
      if (!project.name.includes("Automation")) {
        for (let tech of project.technologies) {
          alltechnoliges.push(tech);
        }
      }
    }
  }
  console.log(completedTaskiD);
  console.log(alltechnoliges);
});


