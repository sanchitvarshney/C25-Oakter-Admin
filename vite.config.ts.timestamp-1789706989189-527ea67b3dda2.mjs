// vite.config.ts
import path from "path";
import react from "file:///D:/Projects/IMS/C25-Oakter-Admin/node_modules/@vitejs/plugin-react-swc/index.js";
import { defineConfig } from "file:///D:/Projects/IMS/C25-Oakter-Admin/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "D:\\Projects\\IMS\\C25-Oakter-Admin";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
      "axios",
      "zod",
      "react-hook-form",
      "@hookform/resolvers",
      "clsx",
      "class-variance-authority",
      "tailwind-merge",
      "lucide-react",
      "uuid",
      "styled-components",
      "@emotion/react",
      "@emotion/styled",
      "@mui/material",
      "@mui/icons-material",
      "@mui/lab",
      "@mui/x-data-grid",
      "antd",
      "ag-grid-community",
      "ag-grid-react",
      "@ag-grid-community/core",
      "@ag-grid-community/react",
      "@ag-grid-community/client-side-row-model",
      "@ag-grid-enterprise/row-grouping"
    ],
    exclude: ["@fingerprintjs/fingerprintjs", "offline-js"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          ui: [
            "@mui/material",
            "@mui/icons-material",
            "@mui/lab",
            "@mui/x-data-grid",
            "antd"
          ],
          grid: [
            "ag-grid-community",
            "ag-grid-react",
            "@ag-grid-community/core",
            "@ag-grid-community/react"
          ],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          utils: [
            "axios",
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "uuid"
          ]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxJTVNcXFxcQzI1LU9ha3Rlci1BZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdHNcXFxcSU1TXFxcXEMyNS1PYWt0ZXItQWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3RzL0lNUy9DMjUtT2FrdGVyLUFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogW1xyXG4gICAgICBcInJlYWN0XCIsXHJcbiAgICAgIFwicmVhY3QtZG9tXCIsXHJcbiAgICAgIFwicmVhY3Qtcm91dGVyLWRvbVwiLFxyXG4gICAgICBcIkByZWR1eGpzL3Rvb2xraXRcIixcclxuICAgICAgXCJyZWFjdC1yZWR1eFwiLFxyXG4gICAgICBcImF4aW9zXCIsXHJcbiAgICAgIFwiem9kXCIsXHJcbiAgICAgIFwicmVhY3QtaG9vay1mb3JtXCIsXHJcbiAgICAgIFwiQGhvb2tmb3JtL3Jlc29sdmVyc1wiLFxyXG4gICAgICBcImNsc3hcIixcclxuICAgICAgXCJjbGFzcy12YXJpYW5jZS1hdXRob3JpdHlcIixcclxuICAgICAgXCJ0YWlsd2luZC1tZXJnZVwiLFxyXG4gICAgICBcImx1Y2lkZS1yZWFjdFwiLFxyXG4gICAgICBcInV1aWRcIixcclxuICAgICAgXCJzdHlsZWQtY29tcG9uZW50c1wiLFxyXG4gICAgICBcIkBlbW90aW9uL3JlYWN0XCIsXHJcbiAgICAgIFwiQGVtb3Rpb24vc3R5bGVkXCIsXHJcbiAgICAgIFwiQG11aS9tYXRlcmlhbFwiLFxyXG4gICAgICBcIkBtdWkvaWNvbnMtbWF0ZXJpYWxcIixcclxuICAgICAgXCJAbXVpL2xhYlwiLFxyXG4gICAgICBcIkBtdWkveC1kYXRhLWdyaWRcIixcclxuICAgICAgXCJhbnRkXCIsXHJcbiAgICAgIFwiYWctZ3JpZC1jb21tdW5pdHlcIixcclxuICAgICAgXCJhZy1ncmlkLXJlYWN0XCIsXHJcbiAgICAgIFwiQGFnLWdyaWQtY29tbXVuaXR5L2NvcmVcIixcclxuICAgICAgXCJAYWctZ3JpZC1jb21tdW5pdHkvcmVhY3RcIixcclxuICAgICAgXCJAYWctZ3JpZC1jb21tdW5pdHkvY2xpZW50LXNpZGUtcm93LW1vZGVsXCIsXHJcbiAgICAgIFwiQGFnLWdyaWQtZW50ZXJwcmlzZS9yb3ctZ3JvdXBpbmdcIixcclxuICAgIF0sXHJcbiAgICBleGNsdWRlOiBbXCJAZmluZ2VycHJpbnRqcy9maW5nZXJwcmludGpzXCIsIFwib2ZmbGluZS1qc1wiXSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgdmVuZG9yOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcclxuICAgICAgICAgIHJvdXRlcjogW1wicmVhY3Qtcm91dGVyLWRvbVwiXSxcclxuICAgICAgICAgIHJlZHV4OiBbXCJAcmVkdXhqcy90b29sa2l0XCIsIFwicmVhY3QtcmVkdXhcIl0sXHJcbiAgICAgICAgICB1aTogW1xyXG4gICAgICAgICAgICBcIkBtdWkvbWF0ZXJpYWxcIixcclxuICAgICAgICAgICAgXCJAbXVpL2ljb25zLW1hdGVyaWFsXCIsXHJcbiAgICAgICAgICAgIFwiQG11aS9sYWJcIixcclxuICAgICAgICAgICAgXCJAbXVpL3gtZGF0YS1ncmlkXCIsXHJcbiAgICAgICAgICAgIFwiYW50ZFwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIGdyaWQ6IFtcclxuICAgICAgICAgICAgXCJhZy1ncmlkLWNvbW11bml0eVwiLFxyXG4gICAgICAgICAgICBcImFnLWdyaWQtcmVhY3RcIixcclxuICAgICAgICAgICAgXCJAYWctZ3JpZC1jb21tdW5pdHkvY29yZVwiLFxyXG4gICAgICAgICAgICBcIkBhZy1ncmlkLWNvbW11bml0eS9yZWFjdFwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIGZvcm1zOiBbXCJyZWFjdC1ob29rLWZvcm1cIiwgXCJAaG9va2Zvcm0vcmVzb2x2ZXJzXCIsIFwiem9kXCJdLFxyXG4gICAgICAgICAgdXRpbHM6IFtcclxuICAgICAgICAgICAgXCJheGlvc1wiLFxyXG4gICAgICAgICAgICBcImNsc3hcIixcclxuICAgICAgICAgICAgXCJjbGFzcy12YXJpYW5jZS1hdXRob3JpdHlcIixcclxuICAgICAgICAgICAgXCJ0YWlsd2luZC1tZXJnZVwiLFxyXG4gICAgICAgICAgICBcInV1aWRcIixcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFIsT0FBTyxVQUFVO0FBQzNTLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUY3QixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTLENBQUMsZ0NBQWdDLFlBQVk7QUFBQSxFQUN4RDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxVQUMzQixPQUFPLENBQUMsb0JBQW9CLGFBQWE7QUFBQSxVQUN6QyxJQUFJO0FBQUEsWUFDRjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsVUFDQSxNQUFNO0FBQUEsWUFDSjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQSxVQUNBLE9BQU8sQ0FBQyxtQkFBbUIsdUJBQXVCLEtBQUs7QUFBQSxVQUN2RCxPQUFPO0FBQUEsWUFDTDtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
