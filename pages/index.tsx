import { createClient } from 'next-sanity'

export default function IndexPage({ pets }) {
  console.log(pets)
  return (
    <>
      <header className="border">
        <h1>Sanity + Next.js</h1>
      </header>
      <main className="flex flex-col gap-3">
        <h2>Pets</h2>
        {pets.length > 0 && (
          <ul>
            {pets.map((pet) => (
              <li key={pet._id} className="border">
                {pet?.name}
              </li>
            ))}
          </ul>
        )}
        {!pets.length && <p>No pets to show</p>}
        {pets.length > 0 && (
          <div>
            <pre>{JSON.stringify(pets, null, 2)}</pre>
          </div>
        )}
        {pets.length > 0 && (
          <div>
            <div>¯\_(ツ)_/¯</div>
            <p>
              Your data will show up here once you add some pets into Sanity
            </p>
          </div>
        )}
      </main>
    </>
  )
}

const client = createClient({
  projectId: 'dd3b6dwa',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
})

export async function getStaticProps() {
  const pets = await client.fetch(`*[_type == "pet"]`)

  return {
    props: {
      pets,
    },
  }
}
