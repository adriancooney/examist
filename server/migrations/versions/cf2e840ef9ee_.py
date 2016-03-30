"""New entity inheritance model and migrating questions.

Revision ID: cf2e840ef9ee
Revises: f724ae8ee68a
Create Date: 2016-03-24 22:21:46.213060

"""

# revision identifiers, used by Alembic.
revision = 'cf2e840ef9ee'
down_revision = 'f724ae8ee68a'

from alembic import op
from collections import deque
import sqlalchemy as sa

questions = sa.Table("question",
    sa.MetaData(),
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("parent_id", sa.Integer())
)

question_revisions = sa.Table("question_revision",
    sa.MetaData(),
    sa.Column("question_id", sa.Integer())
)

revisions = sa.Table("revision",
    sa.MetaData(),
    sa.Column("question_id", sa.Integer())
)

entities = sa.Table("entity",
    sa.MetaData(),
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("type", sa.String())
)

def upgrade():
    op.create_table('entity',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(length=15), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('comment',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('entity_id', sa.Integer(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('parent_id', sa.Integer(), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('deleted', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['entity_id'], ['entity.id'], ),
        sa.ForeignKeyConstraint(['id'], ['entity.id'], ),
        sa.ForeignKeyConstraint(['parent_id'], ['comment.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('like',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('entity_id', sa.Integer(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['entity_id'], ['entity.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('solution',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['id'], ['entity.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Remove the default value
    op.execute("ALTER TABLE question ALTER COLUMN id DROP DEFAULT")
    op.execute("DROP SEQUENCE question_id_seq")

    # Migrate the data
    connection = op.get_bind()

    # We have to remove the parent fk
    op.drop_constraint('question_parent_id_fkey', 'question', type_='foreignkey')
    op.drop_constraint('question_revision_question_id_fkey', 'question_revision', type_='foreignkey')
    op.drop_constraint('revision_question_id_fkey', 'revision', type_='foreignkey')

    # Hold newly created entities
    new_entities = []

    def find_parent_entity(parent_id):
        for entity_id, question_id in new_entities:
            if question_id == parent_id:
                return entity_id

    def create_entity():
        id = connection.execute(
            entities.insert()\
                .values(type="question")\
                .returning(entities.c.id)
        ).scalar()
        print "New Entity: ", id
        return id


    def update_question(current_id, entity_id, parent_entity_id):
        print "Updating question: %r with new entity id: %r (parent %r)" % (current_id, entity_id, parent_entity_id)
        connection.execute(
            questions.update()\
                .where(questions.c.id == current_id)\
                .values(id=entity_id, parent_id=parent_entity_id)
        )

        connection.execute(
            question_revisions.update()\
                .where(question_revisions.c.question_id == current_id)\
                .values(question_id=entity_id)
        )

        connection.execute(
            revisions.update()\
                .where(revisions.c.question_id == current_id)\
                .values(question_id=entity_id)
        )

    # Loop over each question
    question_data = deque([question for question in connection.execute(questions.select())])

    while len(question_data) > 0:
        item = question_data.popleft()
        id, parent_id = item
        parent_entity_id = None

        print "Processing question: id=%r, parent_id=%r" % (id, parent_id)
        if parent_id:
            parent_entity_id = find_parent_entity(parent_id)

            if not parent_entity_id:
                print "Question's parent not yet inserted, passing on %r." % id
                # Push back into the queue
                question_data.append(item)
                continue

        # Create the entity for the question
        question_entity_id = create_entity()
        new_entities.append((question_entity_id, id))

        # Update the old question
        update_question(id, question_entity_id, parent_entity_id)

    op.create_foreign_key('question_id_fkey', 'question', 'entity', ['id'], ['id'])
    op.create_foreign_key('question_revision_question_id_fkey', 'question_revision', 'question', ['question_id'], ['id'])
    op.create_foreign_key('revision_question_id_fkey', 'revision', 'question', ['question_id'], ['id'])
    op.create_foreign_key('question_parent_id_fkey', 'question', 'question', ['parent_id'], ['id'])
    op.execute("ALTER TABLE question ALTER COLUMN id SET NOT NULL")


def downgrade():
    op.execute("CREATE SEQUENCE question_id_seq")
    op.execute("ALTER TABLE question ALTER COLUMN id SET DEFAULT nextval('question_id_seq')")
    op.drop_constraint('question_id_fkey', 'question', type_='foreignkey')
    op.drop_table('solution')
    op.drop_table('like')
    op.drop_table('comment')
    op.drop_table('entity')
