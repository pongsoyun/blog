import { CreatePagesArgs } from 'gatsby';
import path from 'path';
import { Query } from '../graphql-types';

export async function createPages({ actions, graphql }: CreatePagesArgs) {
    const { createPage } = actions;

    const { data, errors } = await graphql<Query>(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        html
                        frontmatter {
                            title
                            path
                            date
                        }
                    }
                }
            }
        }
    `);

    if (errors) {
        throw errors;
    }

    data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: String(node.frontmatter.path),
            context: {
                html: node.html,
                title: node.frontmatter.title,
                date: node.frontmatter.date,
            },
            component: path.resolve(__dirname, '../templates/PostTemplate.tsx'),
        });
    });
}
