### Macaport

This site is home to [Macaport](https://macaport.com/), a screen printing apparel company. It's built with Next.js, Styled Components, Formik, MongoDB, Mailgun, and Stripe. It uses Vercel's API routes and serverless functions.

The site is an e-commerce platform that gives Macaport's clients their own online store to sell their screen printed apparel to their group, organization, business, team, etc.

<br />
<img src="https://res.cloudinary.com/dra3wumrv/image/upload/v1645116732/portfolio-examples/macaport.jpg" alt="Macaport screen printing company store homepage" width="500">

### Member benefits

A store can offer its members a benefit: a store credit, a fixed discount, or a free item. The benefit document lives in the `memberBenefits` collection (shape in `core/memberBenefits/types.ts`) and the store points at it with `benefitId`. Members prove they own a listed email with a six-digit code sent to it, after which a signed, httpOnly cookie identifies them for thirty days.

Requires `MEMBER_BENEFIT_SECRET` in the environment (any long random string; rotating it signs every member out). Until the dashboard can create benefits, use the scripts:

```
node scripts/create-member-benefit.js --store <storeId> --type credit --amount 75 \
  --name "Employee Apparel Credit" --members Employees --csv ./members.csv --apply
node scripts/migrate-member-benefits.js --apply   # one-off: moves the three old programs over
```

Both are dry runs without `--apply`.
