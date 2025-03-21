<!-- Install  TypeScript-->
npm install -g typescript
npm install --save-dev ts-node

<!-- Install Express -->
npm install express
npm install --save-dev @types/express

<!-- Install dotenv -->
npm install dotenv
npm install --save-dev @types/dotenv

<!-- Install cors -->
npm install cors
npm install --save-dev @types/cors

<!-- Bcrypt -->
npm install bcryptjs
npm install --save-dev @types/bcryptjs

<!-- JWTToken -->
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

<!-- Postgres -->
npm install postgres
apt install postgresql
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh

<!-- confige psql if fatal error -->
export $(grep -v '^#' .env | xargs)
echo $DATABASE_URL

<!-- Install redis Socket -->
npm install redis@4.7.0 socket.io@4.8.1

<!-- Install uuid -->
npm install uuid

<!-- create tsconfig.json -->
npx tsc --init
