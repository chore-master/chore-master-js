import guideRepository from '@/libs/guides'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  const guides = await guideRepository.getMetadata()

  return (
    <Container sx={{ my: 4 }}>
      <Grid container spacing={4}>
        {guides
          .filter((guide) => !guide.frontMatter.isDraft)
          .sort(
            (a, b) =>
              new Date(b.frontMatter.date).getTime() -
              new Date(a.frontMatter.date).getTime()
          )
          .map((guide) => {
            const frontMatter = guide.frontMatter
            return (
              <Grid key={frontMatter.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ backgroundColor: 'white' }}>
                  <CardActionArea
                    component={Link}
                    href={`/guides/${frontMatter.slug}`}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" color="primary">
                        {frontMatter.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {frontMatter.excerpt}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(frontMatter.date).toLocaleDateString(
                            locale
                          )}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
      </Grid>
    </Container>
  )
}
