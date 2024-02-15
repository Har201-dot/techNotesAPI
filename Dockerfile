# Use the official Node.js 18 image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3500

# Set environment variables
ENV NODE_ENV=PRODUCTION
ENV PORT=3500
ENV DATABASE_URI=mongodb+srv://s1mplehersh:QqQdrm6oJ6GM6KIm@cluster0.lr3gmca.mongodb.net/CompanyDB?retryWrites=true&w=majority
ENV ACCESS_TOKEN_SECRET=4a631dfd2ce00a028c4d59b5a10ba87139b7d5db3c26eb59d2e17560194e4e37df29226e2d74a468e0f3b58b2012e79c30a373c7572f908fff2289a63b3953c2
ENV REFRESH_TOKEN_SECRET=2ae12ab54efed5c22bf1299f59857efb76dd5efc24a9f2aa0124e94e954796304dc4cb85ec3bd74fb0ce8a30630374c9573863c384e31f06313d254a55a74ba6

# Command to run the application
CMD ["npm", "start"]
