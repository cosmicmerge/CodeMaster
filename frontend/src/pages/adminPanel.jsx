import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [
        { input: '', output: '', explanation: '' }
      ],
      hiddenTestCases: [
        { input: '', output: '' }
      ],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-surface-page text-content-primary p-6 sm:p-10 font-sans selection:bg-btn-primary/30 selection:text-content-primary">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-btn-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-btn-secondary-border/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-linear-to-tr from-btn-primary via-indigo-600 to-purple-500 flex items-center justify-center font-mono font-bold text-btn-primary-text text-base shadow-lg shadow-btn-primary/20">
                &lt;/&gt;
              </span>
              Create New Problem
            </h1>
            <p className="text-content-muted text-sm mt-1">
              Add new coding challenges, test cases, and multi-language starter templates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-panel border border-surface-border text-xs font-semibold text-content-muted hover:text-content-primary transition-all duration-200"
          >
            ← Back to Challenges
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <section className="bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-content-accent flex items-center gap-2 border-b border-surface-border pb-3">
              <span className="w-2 h-2 rounded-full bg-btn-primary"></span>
              Basic Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                  Title
                </label>
                <input
                  {...register('title')}
                  placeholder="e.g. Two Sum"
                  className={`w-full bg-surface-panel border ${
                    errors.title ? 'border-btn-danger' : 'border-surface-border'
                  } rounded-2xl px-4 py-2.5 text-sm text-content-primary placeholder:text-content-muted/50 outline-none focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/20 transition-all`}
                />
                {errors.title && (
                  <span className="text-xs text-btn-danger font-medium">{errors.title.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Describe the problem statement, constraints, and requirements..."
                  rows={5}
                  className={`w-full bg-surface-panel border ${
                    errors.description ? 'border-btn-danger' : 'border-surface-border'
                  } rounded-2xl p-4 text-sm text-content-primary placeholder:text-content-muted/50 outline-none focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/20 transition-all`}
                />
                {errors.description && (
                  <span className="text-xs text-btn-danger font-medium">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                    Difficulty
                  </label>
                  <select
                    {...register('difficulty')}
                    className="w-full bg-surface-panel border border-surface-border rounded-2xl px-4 py-2.5 text-sm text-content-primary outline-none focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/20 transition-all cursor-pointer"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                    Topic Tag
                  </label>
                  <select
                    {...register('tags')}
                    className="w-full bg-surface-panel border border-surface-border rounded-2xl px-4 py-2.5 text-sm text-content-primary outline-none focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/20 transition-all cursor-pointer"
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Test Cases */}
          <section className="bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-8">
            <h2 className="text-lg font-bold tracking-tight text-content-accent flex items-center gap-2 border-b border-surface-border pb-3">
              <span className="w-2 h-2 rounded-full bg-btn-primary"></span>
              Test Cases Configuration
            </h2>

            {/* Visible Cases */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-content-primary">
                    Visible Test Cases (Examples)
                  </h3>
                  <p className="text-xs text-content-muted">
                    Shown directly on the problem description page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="px-3 py-1.5 rounded-xl bg-btn-primary/10 hover:bg-btn-primary/20 border border-btn-primary/30 text-xs font-semibold text-btn-secondary-text transition-all cursor-pointer"
                >
                  + Add Visible Case
                </button>
              </div>

              {errors.visibleTestCases?.message && (
                <p className="text-xs text-btn-danger font-medium">
                  {errors.visibleTestCases.message}
                </p>
              )}

              <div className="space-y-4">
                {visibleFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-surface-panel/70 border border-surface-border rounded-2xl p-4 sm:p-5 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-content-accent">
                        Visible Case #{index + 1}
                      </span>
                      {visibleFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="text-xs font-medium text-btn-danger hover:text-red-300 transition-colors px-2 py-1 rounded-lg hover:bg-btn-danger/10"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        {...register(`visibleTestCases.${index}.input`)}
                        placeholder="Input (e.g. nums = [2,7,11,15], target = 9)"
                        className="bg-surface-card border border-surface-border rounded-xl px-3.5 py-2 text-xs text-content-primary outline-none focus:border-btn-primary"
                      />
                      <input
                        {...register(`visibleTestCases.${index}.output`)}
                        placeholder="Expected Output (e.g. [0,1])"
                        className="bg-surface-card border border-surface-border rounded-xl px-3.5 py-2 text-xs text-content-primary outline-none focus:border-btn-primary"
                      />
                    </div>

                    <textarea
                      {...register(`visibleTestCases.${index}.explanation`)}
                      placeholder="Explanation (e.g. Because nums[0] + nums[1] == 9, return [0, 1].)"
                      rows={2}
                      className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs text-content-primary outline-none focus:border-btn-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Cases */}
            <div className="space-y-4 pt-4 border-t border-surface-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-content-primary">
                    Hidden Test Cases (Validation)
                  </h3>
                  <p className="text-xs text-content-muted">
                    Evaluated privately by the code execution engine.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="px-3 py-1.5 rounded-xl bg-btn-primary/10 hover:bg-btn-primary/20 border border-btn-primary/30 text-xs font-semibold text-btn-secondary-text transition-all cursor-pointer"
                >
                  + Add Hidden Case
                </button>
              </div>

              {errors.hiddenTestCases?.message && (
                <p className="text-xs text-btn-danger font-medium">
                  {errors.hiddenTestCases.message}
                </p>
              )}

              <div className="space-y-3">
                {hiddenFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-surface-panel/70 border border-surface-border rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  >
                    <span className="text-xs font-mono font-semibold text-content-muted sm:w-20">
                      Hidden #{index + 1}
                    </span>
                    <input
                      {...register(`hiddenTestCases.${index}.input`)}
                      placeholder="Input"
                      className="flex-1 bg-surface-card border border-surface-border rounded-xl px-3.5 py-2 text-xs text-content-primary outline-none focus:border-btn-primary"
                    />
                    <input
                      {...register(`hiddenTestCases.${index}.output`)}
                      placeholder="Output"
                      className="flex-1 bg-surface-card border border-surface-border rounded-xl px-3.5 py-2 text-xs text-content-primary outline-none focus:border-btn-primary"
                    />
                    {hiddenFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="text-xs text-btn-danger hover:text-red-300 py-1.5 px-3 rounded-lg hover:bg-btn-danger/10 self-end sm:self-center transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Templates & Solutions */}
          <section className="bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-content-accent flex items-center gap-2 border-b border-surface-border pb-3">
              <span className="w-2 h-2 rounded-full bg-btn-primary"></span>
              Code Templates & Solutions
            </h2>

            <div className="grid grid-cols-1 gap-8">
              {[0, 1, 2].map((index) => {
                const langName = index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript';
                return (
                  <div
                    key={index}
                    className="bg-surface-panel/50 border border-surface-border rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
                      <h3 className="font-semibold text-sm text-content-primary flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-btn-primary/15 text-btn-secondary-text border border-btn-primary/25 font-mono text-xs">
                          {langName}
                        </span>
                        Language Setup
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                          Starter Boilerplate
                        </label>
                        <textarea
                          {...register(`startCode.${index}.initialCode`)}
                          placeholder={`// Initial ${langName} signature...`}
                          rows={7}
                          className="w-full bg-[#131122] border border-surface-border rounded-xl p-3.5 font-mono text-xs text-content-primary outline-none focus:border-btn-primary transition-all leading-relaxed"
                        />
                        {errors.startCode?.[index]?.initialCode && (
                          <span className="text-xs text-btn-danger">
                            {errors.startCode[index].initialCode.message}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                          Reference Solution
                        </label>
                        <textarea
                          {...register(`referenceSolution.${index}.completeCode`)}
                          placeholder={`// Complete working ${langName} solution...`}
                          rows={7}
                          className="w-full bg-[#131122] border border-surface-border rounded-xl p-3.5 font-mono text-xs text-content-primary outline-none focus:border-btn-primary transition-all leading-relaxed"
                        />
                        {errors.referenceSolution?.[index]?.completeCode && (
                          <span className="text-xs text-btn-danger">
                            {errors.referenceSolution[index].completeCode.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-btn-primary hover:bg-[#6c64ce] text-btn-primary-text font-bold text-sm shadow-xl shadow-btn-primary/25 hover:shadow-btn-primary/40 transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            Publish Challenge
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;